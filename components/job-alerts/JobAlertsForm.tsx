"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RefreshCw, ArrowRight } from "lucide-react";
import { resolveColor } from "@/lib/utils/colors";
import config from "@/config";

export function JobAlertsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    let isValid = true;

    // Validate name
    if (!name || name.trim() === "") {
      newErrors.name =
        config.jobAlerts.form?.fields?.name?.required || "Name is required";
      isValid = false;
    }

    // Validate email with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      newErrors.email =
        config.jobAlerts.form?.fields?.email?.required || "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email =
        config.jobAlerts.form?.fields?.email?.invalid ||
        "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuccess) return;

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call our API route
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show success message
        toast({
          title:
            config.jobAlerts.form?.toast?.success?.title ||
            "Subscription successful!",
          description:
            config.jobAlerts.form?.toast?.success?.description ||
            "You'll now receive job alerts in your inbox.",
          variant: "default",
          className: "bg-white border border-green-200 shadow-md",
        });

        // Set success state
        setIsSuccess(true);
      } else if (response.status === 429) {
        // Rate limit error
        toast({
          title:
            config.jobAlerts.form?.toast?.rateLimit?.title ||
            "Rate limit exceeded",
          description:
            config.jobAlerts.form?.toast?.rateLimit?.description ||
            "Too many requests. Please try again later.",
          variant: "destructive",
          className: "bg-destructive border border-red-600 shadow-md",
        });
      } else {
        throw new Error(result.error || "Subscription failed");
      }
    } catch (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      error: unknown
    ) {
      // Error handling - error variable is used for type safety but we don't need to use it directly in production
      if (error instanceof Error && error.message) {
        toast({
          title: "Subscription failed",
          description: error.message,
          variant: "destructive",
          className: "bg-destructive border border-red-600 shadow-md",
        });
      } else {
        toast({
          title:
            config.jobAlerts.form?.toast?.error?.title ||
            "Something went wrong",
          description:
            config.jobAlerts.form?.toast?.error?.description ||
            "Failed to subscribe to job alerts. Please try again.",
          variant: "destructive",
          className: "bg-destructive border border-red-600 shadow-md",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isSuccess ? (
        <div className="p-6 border rounded-lg border-green-200 bg-green-50">
          <div className="flex flex-col items-center text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <h3 className="text-md font-semibold text-green-800">
              {config.jobAlerts.form?.successHeading ||
                "Subscription Confirmed!"}
            </h3>
            <p className="text-sm text-green-700 mb-4">
              {config.jobAlerts.form?.successDescription ||
                "Thank you for subscribing to job alerts. You'll receive emails when jobs matching your interests are posted."}
            </p>
            <Button
              onClick={handleReset}
              variant="outline"
              size="xs"
              className="gap-1.5 text-xs"
            >
              {config.jobAlerts.form?.resetButtonText ||
                "Subscribe with another email"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5 border rounded-lg hover:border-gray-400 transition-all">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {config.jobAlerts.form?.fields?.name?.label || "Name *"}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={
                    config.jobAlerts.form?.fields?.name?.placeholder ||
                    "Your name"
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-7 text-xs w-full"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {config.jobAlerts.form?.fields?.email?.label || "Email *"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={
                    config.jobAlerts.form?.fields?.email?.placeholder ||
                    "your@email.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="h-7 text-xs w-full"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="xs"
              className="w-full gap-1.5 text-xs"
              disabled={isSubmitting}
              style={{
                backgroundColor: resolveColor(config.ui.primaryColor),
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {config.jobAlerts.form?.loadingText || "Subscribing..."}
                </>
              ) : (
                <>
                  {config.jobAlerts.form?.buttonText ||
                    "Subscribe to Job Alerts"}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
