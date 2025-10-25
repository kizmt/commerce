"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { useState } from "react";

interface Address {
  address1: string;
  address2?: string | null;
  city: string;
  provinceCode?: string | null;
  zip: string;
  countryCode: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  defaultAddress?: Address | null;
}

interface ProfileFormProps {
  initialData: CustomerData;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    address1: initialData.defaultAddress?.address1 || "",
    address2: initialData.defaultAddress?.address2 || "",
    city: initialData.defaultAddress?.city || "",
    provinceCode: initialData.defaultAddress?.provinceCode || "",
    zip: initialData.defaultAddress?.zip || "",
    countryCode: initialData.defaultAddress?.countryCode || "NZ",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/customer/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          defaultAddress: {
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            provinceCode: formData.provinceCode,
            zip: formData.zip,
            countryCode: formData.countryCode,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
          Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            {!isEditing && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                {isEditing ? (
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    required
                  />
                ) : (
                  <p className="py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.firstName || "-"}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                {isEditing ? (
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    required
                  />
                ) : (
                  <p className="py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.lastName || "-"}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <p className="py-2 text-neutral-500 dark:text-neutral-400">
                {initialData.email}
              </p>
              <FieldDescription>
                Contact support to change your email
              </FieldDescription>
            </Field>
          </FieldGroup>
        </div>

        {/* Default Address */}
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="mb-4 text-lg font-semibold">Default Address</h2>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="address1">Address Line 1</FieldLabel>
              {isEditing ? (
                <input
                  id="address1"
                  type="text"
                  value={formData.address1}
                  onChange={(e) =>
                    setFormData({ ...formData, address1: e.target.value })
                  }
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  placeholder="123 Main Street"
                />
              ) : (
                <p className="py-2 text-neutral-700 dark:text-neutral-300">
                  {formData.address1 || "-"}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="address2">
                Address Line 2 (Optional)
              </FieldLabel>
              {isEditing ? (
                <input
                  id="address2"
                  type="text"
                  value={formData.address2}
                  onChange={(e) =>
                    setFormData({ ...formData, address2: e.target.value })
                  }
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  placeholder="Apartment, suite, etc."
                />
              ) : (
                <p className="py-2 text-neutral-700 dark:text-neutral-300">
                  {formData.address2 || "-"}
                </p>
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                {isEditing ? (
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    placeholder="Auckland"
                  />
                ) : (
                  <p className="py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.city || "-"}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                {isEditing ? (
                  <input
                    id="zip"
                    type="text"
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    placeholder="1010"
                  />
                ) : (
                  <p className="py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.zip || "-"}
                  </p>
                )}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="provinceCode">Region/State</FieldLabel>
                {isEditing ? (
                  <input
                    id="provinceCode"
                    type="text"
                    value={formData.provinceCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        provinceCode: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    placeholder="AUK"
                  />
                ) : (
                  <p className="py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.provinceCode || "-"}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="countryCode">Country</FieldLabel>
                {isEditing ? (
                  <select
                    id="countryCode"
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData({ ...formData, countryCode: e.target.value })
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <option value="NZ">New Zealand</option>
                    <option value="AU">Australia</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                ) : (
                  <p className="py-2 text-neutral-700 dark:text-neutral-300">
                    {formData.countryCode === "NZ"
                      ? "New Zealand"
                      : formData.countryCode}
                  </p>
                )}
              </Field>
            </div>
          </FieldGroup>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setError(null);
                // Reset form data to initial values
                setFormData({
                  firstName: initialData.firstName || "",
                  lastName: initialData.lastName || "",
                  address1: initialData.defaultAddress?.address1 || "",
                  address2: initialData.defaultAddress?.address2 || "",
                  city: initialData.defaultAddress?.city || "",
                  provinceCode: initialData.defaultAddress?.provinceCode || "",
                  zip: initialData.defaultAddress?.zip || "",
                  countryCode: initialData.defaultAddress?.countryCode || "NZ",
                });
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
