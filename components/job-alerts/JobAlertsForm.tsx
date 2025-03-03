"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RefreshCw } from "lucide-react";

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
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Validate email with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
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
          title: "Subscription successful!",
          description: "You'll now receive job alerts in your inbox.",
          variant: "default",
        });

        // Set success state
        setIsSuccess(true);
      } else if (response.status === 429) {
        // Rate limit error
        toast({
          title: "Rate limit exceeded",
          description: "Too many requests. Please try again later.",
          variant: "destructive",
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
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Failed to subscribe to job alerts. Please try again.",
          variant: "destructive",
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
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Subscription Confirmed!
          </h3>
          <p className="text-green-700 mb-4">
            Thank you for subscribing to job alerts. You&apos;ll receive emails
            when jobs matching your interests are posted.
          </p>
          <Button onClick={handleReset} variant="outline">
            Subscribe with another email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe to Job Alerts"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
