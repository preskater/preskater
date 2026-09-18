"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, PlusIcon } from "lucide-react"
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ActionResult } from "@/lib/crm/types"

export type FormFieldConfig = {
  name: string
  label: string
  type?: "text" | "email" | "number" | "date" | "textarea" | "select"
  options?: { label: string; value: string }[]
  placeholder?: string
  description?: string
  fullWidth?: boolean
  step?: string
}

type ResourceFormDialogProps = {
  title: string
  description?: string
  submitLabel?: string
  triggerLabel?: string
  schema: z.ZodType<FieldValues, FieldValues>
  defaultValues: DefaultValues<FieldValues>
  fields: FormFieldConfig[]
  action: (
    values: Record<string, unknown>,
    id?: string
  ) => Promise<ActionResult>
  id?: string
  hiddenValues?: Record<string, unknown>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ResourceFormDialog({
  title,
  description,
  submitLabel = "Enregistrer",
  triggerLabel,
  schema,
  defaultValues,
  fields,
  action,
  id,
  hiddenValues,
  open: controlledOpen,
  onOpenChange,
}: ResourceFormDialogProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const form = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const defaultsRef = React.useRef(defaultValues)
  defaultsRef.current = defaultValues
  const wasOpen = React.useRef(false)

  React.useEffect(() => {
    if (open && !wasOpen.current) {
      form.reset(defaultsRef.current)
    }
    wasOpen.current = open
  }, [open, form])

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const result = await action({ ...values, ...hiddenValues }, id)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message ?? "Enregistré.")
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerLabel && (
        <DialogTrigger render={<Button variant="default" size="sm" />}>
          <PlusIcon />
          {triggerLabel}
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => {
                const error = form.formState.errors[field.name]
                const message =
                  typeof error?.message === "string" ? error.message : undefined

                return (
                  <Field
                    key={field.name}
                    data-invalid={!!error}
                    className={field.fullWidth ? "sm:col-span-2" : undefined}
                  >
                    <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        aria-invalid={!!error}
                        {...form.register(field.name as Path<FieldValues>)}
                      />
                    ) : field.type === "select" ? (
                      <Select
                        items={field.options}
                        value={
                          (form.watch(field.name) as string | undefined) ?? ""
                        }
                        onValueChange={(value) =>
                          form.setValue(
                            field.name,
                            (value ?? "") as never,
                            { shouldValidate: true }
                          )
                        }
                      >
                        <SelectTrigger id={field.name} className="w-full">
                          <SelectValue placeholder={field.placeholder ?? "—"} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type ?? "text"}
                        step={field.step}
                        placeholder={field.placeholder}
                        aria-invalid={!!error}
                        {...form.register(field.name as Path<FieldValues>)}
                      />
                    )}
                    {field.description && !message && (
                      <p className="text-xs text-muted-foreground">
                        {field.description}
                      </p>
                    )}
                    <FieldError errors={message ? [{ message }] : []} />
                  </Field>
                )
              })}
            </div>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <LoaderIcon className="animate-spin" />
              )}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
