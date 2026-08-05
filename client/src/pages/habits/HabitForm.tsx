import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createHabit, getHabit, updateHabit, type HabitPayload } from "../../api/habits";
import { getErrorMessage } from "../../api/client";
import type { FrequencyType } from "../../types";
import { toast } from "react-toastify";

const CATEGORIES = [
  "Health",
  "Fitness",
  "Productivity",
  "Learning",
  "Mindfulness",
  "Finance",
  "Social",
  "Other",
];

const ICONS = ["⭐", "💧", "🏃", "📚", "🧘", "🥗", "💪", "😴", "🚭", "💰", "✍️", "🎯"];

const COLORS = [
  "#3498db",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#34495e",
];

const WEEKDAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

interface FormValues {
  title: string;
  description: string;
  category: string;
  customCategory: string;
  frequencyType: FrequencyType;
  days: number[];
  timesPerPeriod: number;
  periodLength: number;
  icon: string;
  color: string;
  reminderEnabled: boolean;
  reminderTime: string;
}

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["title", "description"],
  ["category", "customCategory"],
  ["frequencyType", "days", "timesPerPeriod", "periodLength"],
  ["icon", "color"],
  ["reminderEnabled", "reminderTime"],
];

const STEP_LABELS = ["Basics", "Category", "Frequency", "Icon & Color", "Reminder"];

const HabitSchema = Yup.object({
  title: Yup.string().trim().required("Give your habit a title"),
  description: Yup.string().max(300, "Keep it under 300 characters"),
  category: Yup.string().required("Pick a category"),
  customCategory: Yup.string().when("category", {
    is: "Other",
    then: (schema) => schema.trim().required("Enter a custom category"),
  }),
  frequencyType: Yup.mixed<FrequencyType>()
    .oneOf(["daily", "daysOfWeek", "daysOfMonth", "timesPerPeriod"])
    .required(),
  days: Yup.array().when("frequencyType", {
    is: (val: FrequencyType) => val === "daysOfWeek" || val === "daysOfMonth",
    then: (schema) => schema.min(1, "Pick at least one day"),
  }),
  timesPerPeriod: Yup.number().when("frequencyType", {
    is: "timesPerPeriod",
    then: (schema) => schema.min(1, "Must be at least 1").required("Required"),
  }),
  periodLength: Yup.number().when("frequencyType", {
    is: "timesPerPeriod",
    then: (schema) => schema.min(1, "Must be at least 1").required("Required"),
  }),
  icon: Yup.string().required(),
  color: Yup.string().required(),
  reminderEnabled: Yup.boolean(),
  reminderTime: Yup.string().when("reminderEnabled", {
    is: true,
    then: (schema) => schema.required("Pick a reminder time"),
  }),
});

const initialValues: FormValues = {
  title: "",
  description: "",
  category: "",
  customCategory: "",
  frequencyType: "daily",
  days: [],
  timesPerPeriod: 3,
  periodLength: 7,
  icon: ICONS[0],
  color: COLORS[0],
  reminderEnabled: false,
  reminderTime: "",
};

function toPayload(values: FormValues): HabitPayload {
  const category = values.category === "Other" ? values.customCategory.trim() : values.category;

  const targetFrequency: HabitPayload["targetFrequency"] = { type: values.frequencyType };
  if (values.frequencyType === "daysOfWeek" || values.frequencyType === "daysOfMonth") {
    targetFrequency.days = values.days;
  }
  if (values.frequencyType === "timesPerPeriod") {
    targetFrequency.timesPerPeriod = values.timesPerPeriod;
    targetFrequency.periodLength = values.periodLength;
  }

  return {
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    category,
    icon: values.icon,
    color: values.color,
    targetFrequency,
    reminder: {
      enabled: values.reminderEnabled,
      time: values.reminderEnabled ? values.reminderTime : undefined,
    },
  };
}

export function HabitForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [initial, setInitial] = useState<FormValues>(initialValues);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const habit = await getHabit(id);
        if (cancelled) return;
        const isPreset = CATEGORIES.includes(habit.category);
        setInitial({
          title: habit.title,
          description: habit.description ?? "",
          category: isPreset ? habit.category : "Other",
          customCategory: isPreset ? "" : habit.category,
          frequencyType: habit.targetFrequency.type,
          days: habit.targetFrequency.days ?? [],
          timesPerPeriod: habit.targetFrequency.timesPerPeriod ?? 3,
          periodLength: habit.targetFrequency.periodLength ?? 7,
          icon: habit.icon,
          color: habit.color,
          reminderEnabled: habit.reminder?.enabled ?? false,
          reminderTime: habit.reminder?.time ?? "",
        });
      } catch (err) {
        if (!cancelled) setFormError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-slate">Loading habit…</div>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {isEdit ? "Edit habit" : "Add a new habit"}
      </h1>

      {/* Step indicator */}
      <ol className="mt-4 mb-8 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                i <= step ? "bg-ink text-paper" : "bg-slate/15 text-slate"
              }`}
            >
              {i + 1}
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`h-px flex-1 ${i < step ? "bg-ink" : "bg-slate/15"}`} />
            )}
          </li>
        ))}
      </ol>
      <p className="-mt-6 mb-6 text-xs font-medium uppercase tracking-wide text-slate">
        Step {step + 1} of {STEP_LABELS.length}: {STEP_LABELS[step]}
      </p>

      <Formik
        enableReinitialize
        initialValues={initial}
        validationSchema={HabitSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setFormError(null);
          try {
            const payload = toPayload(values);
            if (isEdit && id) {
              await updateHabit(id, payload);
              toast.success("Habit updated!");
            } else {
              await createHabit(payload);
              toast.success("Habit created!");
            }
            navigate("/dashboard");
          } catch (err) {
            const message = getErrorMessage(err);
            toast.error(message);
            setFormError(message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, touched, setFieldValue, validateForm, setTouched, isSubmitting, dirty, errors, handleSubmit }) => {
          const toggleDay = (day: number) => {
            const next = values.days.includes(day)
              ? values.days.filter((d) => d !== day)
              : [...values.days, day];
            setFieldValue("days", next);
          };

          const goNext = async (e: React.MouseEvent) => {
            e.preventDefault();
            const allErrors = await validateForm();
            const fieldsThisStep = STEP_FIELDS[step];
            const stepTouched = Object.fromEntries(fieldsThisStep.map((f) => [f, true]));
            setTouched({ ...touched, ...stepTouched }, false);

            const hasError = fieldsThisStep.some((f) => Boolean((allErrors as Record<string, unknown>)[f]));
            if (!hasError) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
          };

          const goBack = (e: React.MouseEvent) => {
            e.preventDefault();
            setStep((s) => Math.max(s - 1, 0));
          };

          return (
            <Form 
              className="space-y-5" 
              noValidate 
              onKeyDown={(e) => {
                // Prevent implicit form submission on Enter key on earlier steps
                if (e.key === "Enter" && step < STEP_LABELS.length - 1) {
                  e.preventDefault();
                  goNext(e as any);
                }
              }}
            >
              {step === 0 && (
                <>
                  <div>
                    <label htmlFor="title" className="field-label">Title</label>
                    <Field id="title" name="title" type="text" className="field-input" placeholder="Drink water" />
                    <ErrorMessage name="title" component="p" className="field-error" />
                  </div>
                  <div>
                    <label htmlFor="description" className="field-label">Description (optional)</label>
                    <Field
                      id="description"
                      name="description"
                      as="textarea"
                      rows={3}
                      className="field-input"
                      placeholder="Why does this habit matter to you?"
                    />
                    <ErrorMessage name="description" component="p" className="field-error" />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <label className="field-label">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFieldValue("category", cat)}
                          className={`rounded-md border px-3 py-2 text-sm transition ${
                            values.category === cat
                              ? "border-ink bg-ink text-paper"
                              : "border-slate/20 text-ink hover:border-ink/40"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <ErrorMessage name="category" component="p" className="field-error" />
                  </div>

                  {values.category === "Other" && (
                    <div>
                      <label htmlFor="customCategory" className="field-label">Custom category</label>
                      <Field id="customCategory" name="customCategory" type="text" className="field-input" placeholder="e.g. Reading" />
                      <ErrorMessage name="customCategory" component="p" className="field-error" />
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="field-label">How often?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["daily", "Every day"],
                          ["daysOfWeek", "Specific weekdays"],
                          ["daysOfMonth", "Specific dates"],
                          ["timesPerPeriod", "X times per period"],
                        ] as [FrequencyType, string][]
                      ).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFieldValue("frequencyType", val)}
                          className={`rounded-md border px-3 py-2 text-sm transition ${
                            values.frequencyType === val
                              ? "border-ink bg-ink text-paper"
                              : "border-slate/20 text-ink hover:border-ink/40"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {values.frequencyType === "daysOfWeek" && (
                    <div>
                      <label className="field-label">Which days?</label>
                      <div className="flex flex-wrap gap-2">
                        {WEEKDAYS.map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => toggleDay(d.value)}
                            className={`h-10 w-12 rounded-md border text-sm transition ${
                              values.days.includes(d.value)
                                ? "border-ink bg-ink text-paper"
                                : "border-slate/20 text-ink hover:border-ink/40"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                      <ErrorMessage name="days" component="p" className="field-error" />
                    </div>
                  )}

                  {values.frequencyType === "daysOfMonth" && (
                    <div>
                      <label className="field-label">Which dates? (1–31)</label>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`h-9 rounded-md border text-xs transition ${
                              values.days.includes(day)
                                ? "border-ink bg-ink text-paper"
                                : "border-slate/20 text-ink hover:border-ink/40"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <ErrorMessage name="days" component="p" className="field-error" />
                    </div>
                  )}

                  {values.frequencyType === "timesPerPeriod" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="timesPerPeriod" className="field-label">Times</label>
                        <Field id="timesPerPeriod" name="timesPerPeriod" type="number" min={1} className="field-input" />
                        <ErrorMessage name="timesPerPeriod" component="p" className="field-error" />
                      </div>
                      <div>
                        <label htmlFor="periodLength" className="field-label">Per how many days</label>
                        <Field id="periodLength" name="periodLength" type="number" min={1} className="field-input" />
                        <ErrorMessage name="periodLength" component="p" className="field-error" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="field-label">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {ICONS.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFieldValue("icon", icon)}
                          className={`flex h-10 items-center justify-center rounded-md border text-lg transition ${
                            values.icon === icon
                              ? "border-ink bg-ink/5"
                              : "border-slate/20 hover:border-ink/40"
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFieldValue("color", color)}
                          className={`h-9 w-9 rounded-full border-2 transition ${
                            values.color === color ? "border-ink" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-md border border-slate/15 p-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                      style={{ backgroundColor: `${values.color}20` }}
                    >
                      {values.icon}
                    </span>
                    <span className="text-sm text-slate">Preview</span>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="reminderEnabled" className="h-4 w-4" />
                    <span className="field-label !mb-0">Remind me</span>
                  </label>

                  {values.reminderEnabled && (
                    <div>
                      <label htmlFor="reminderTime" className="field-label">Reminder time</label>
                      <Field id="reminderTime" name="reminderTime" type="time" className="field-input" />
                      <ErrorMessage name="reminderTime" component="p" className="field-error" />
                    </div>
                  )}
                </>
              )}

              {formError && (
                <p className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay-dark">{formError}</p>
              )}

              {/* Debug validation errors */}
              {Object.keys(errors).length > 0 && (
                <div className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay-dark">
                  <strong>Hidden Validation Errors:</strong>
                  <pre>{JSON.stringify(errors, null, 2)}</pre>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    if (step === 0) {
                      e.preventDefault();
                      navigate(-1);
                    } else {
                      goBack(e);
                    }
                  }}
                  className="btn-secondary"
                >
                  {step === 0 ? "Cancel" : "Back"}
                </button>

                {step < STEP_LABELS.length - 1 ? (
                  <button type="button" onClick={goNext} className="btn-primary">
                    Next
                  </button>
                ) : (
                  <button 
                    type="button" 
                    disabled={isSubmitting} 
                    className="btn-primary"
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        alert("Please fix the hidden errors: " + JSON.stringify(errors));
                      } else {
                        // Manually submit the form to bypass any implicit HTML issues
                        const syntheticEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
                        handleSubmit(syntheticEvent);
                      }
                    }}
                  >
                    {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create habit"}
                  </button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}