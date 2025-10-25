"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useState } from "react";

interface SettingsFormProps {
  initialAcceptsMarketing: boolean;
}

export function SettingsForm({ initialAcceptsMarketing }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [acceptsMarketing, setAcceptsMarketing] = useState(
    initialAcceptsMarketing,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/customer/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptsMarketing,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
          Settings updated successfully!
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Preferences */}
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="mb-4 text-lg font-semibold">Email Preferences</h2>

          <FieldGroup>
            <Field>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acceptsMarketing"
                  checked={acceptsMarketing}
                  onCheckedChange={(checked) => setAcceptsMarketing(!!checked)}
                />
                <div className="flex-1">
                  <FieldLabel
                    htmlFor="acceptsMarketing"
                    className="cursor-pointer"
                  >
                    Subscribe to marketing emails
                  </FieldLabel>
                  <FieldDescription>
                    Receive updates about new products, special offers, and
                    exclusive deals. You can unsubscribe at any time.
                  </FieldDescription>
                </div>
              </div>
            </Field>
          </FieldGroup>
        </div>

        {/* Privacy Information */}
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="mb-4 text-lg font-semibold">Privacy & Data</h2>

          <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
            <p>
              Your data is stored securely and handled in accordance with our{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </a>
              .
            </p>
            <p>
              To request deletion of your account and data, please{" "}
              <a
                href="/contact"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
