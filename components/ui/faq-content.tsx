"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Link as LinkIcon, X, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useRouter, useSearchParams } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import type { FAQPage, WithContext, Question, Answer } from "schema-dts";
import { resolveColor } from "@/lib/utils/colors";
import config from "@/config";

// Define the types based on the config
interface FAQItem {
  question: string;
  answer: string;
  isRichText?: boolean;
}

// We're using this interface in the ReadonlyArray type below
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FAQCategory {
  title: string;
  items: FAQItem[];
}

interface FAQContentProps {
  categories: ReadonlyArray<{
    readonly title: string;
    readonly items: ReadonlyArray<{
      readonly question: string;
      readonly answer: string;
      readonly isRichText?: boolean;
    }>;
  }>;
}

export function FAQContent({ categories }: FAQContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Generate a stable ID for each FAQ item
  const getItemId = (categoryTitle: string, question: string) => {
    return `${slugify(categoryTitle)}-${slugify(question)}`;
  };

  // Get the search query from URL if it exists
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    }

    // Check for hash in URL for anchor links
    const hash = window.location.hash;
    if (hash) {
      const categoryId = hash.substring(1); // Remove the # character
      setTimeout(() => {
        const element = document.getElementById(categoryId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });

          // Find and expand the items in this category
          const categoryIndex = categories.findIndex(
            (cat) => slugify(cat.title) === categoryId
          );
          if (categoryIndex !== -1) {
            const category = categories[categoryIndex];
            const itemIds = category.items.map((item) =>
              getItemId(category.title, item.question)
            );
            setExpandedItems(itemIds);
          }
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    // If search is empty, collapse all items
    if (!value.trim()) {
      setExpandedItems([]);
      return;
    }

    // Find items that match the search term
    const matchingItems: string[] = [];

    categories.forEach((category) => {
      category.items.forEach((item) => {
        const questionMatch = item.question
          .toLowerCase()
          .includes(value.toLowerCase());
        const answerMatch = item.answer
          .toLowerCase()
          .includes(value.toLowerCase());

        if (questionMatch || answerMatch) {
          matchingItems.push(getItemId(category.title, item.question));
        }
      });
    });

    // Expand matching items
    setExpandedItems(matchingItems);

    // Update URL with search query
    if (value.trim()) {
      router.replace(`/faq?q=${encodeURIComponent(value)}`, { scroll: false });
    } else {
      router.replace("/faq", { scroll: false });
    }
  };

  // Handle keyboard navigation
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchTerm("");
      setExpandedItems([]);
      router.replace("/faq", { scroll: false });
    }
  };

  // Generate FAQ schema for SEO
  const generateFAQSchema = () => {
    // Create type-safe schema using schema-dts
    const faqSchema: WithContext<FAQPage> = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: categories.flatMap((category) =>
        category.items.map(
          (item) =>
            ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              } as Answer,
            } as Question)
        )
      ),
    };

    return JSON.stringify(faqSchema);
  };

  // Scroll to category - keeping this for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${categoryId}`);
    }
  };

  // Filter categories based on search term
  const filteredCategories = searchTerm.trim()
    ? categories
        .map((category) => ({
          ...category,
          items: category.items.filter(
            (item) =>
              item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((category) => category.items.length > 0)
    : categories;

  return (
    <>
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateFAQSchema() }}
      />

      {/* Search Bar */}
      <div className="mb-8 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search FAQs..."
            className="pl-9 h-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            aria-label="Search FAQs"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setExpandedItems([]);
                router.replace("/faq", { scroll: false });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-zinc-600 mb-4">
              No results found for &quot;{searchTerm}&quot;
            </p>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setSearchTerm("");
                setExpandedItems([]);
                router.replace("/faq", { scroll: false });
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          filteredCategories.map((category, categoryIndex) => {
            const categoryId = slugify(category.title);
            return (
              <div
                key={categoryIndex}
                className="space-y-4"
                id={categoryId}
                ref={(el) => {
                  categoryRefs.current[categoryId] = el;
                }}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {category.title}
                  </h2>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/faq#${categoryId}`
                      );
                      // You could add a toast notification here
                    }}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors"
                    aria-label={`Copy link to ${category.title} section`}
                    title="Copy link to this section"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
                <Accordion
                  type="multiple"
                  value={expandedItems}
                  onValueChange={setExpandedItems}
                  className="space-y-2"
                >
                  {category.items.map((item, itemIndex) => {
                    const itemId = getItemId(category.title, item.question);
                    return (
                      <AccordionItem
                        key={itemIndex}
                        value={itemId}
                        className="border border-zinc-200 rounded-lg px-4 overflow-hidden"
                      >
                        <AccordionTrigger className="text-sm font-medium text-zinc-800 py-4 hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-zinc-600 pb-4 pt-1">
                          {item.isRichText ? (
                            <div className="markdown-content">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                  // Apply primary color to all links in markdown content
                                  a: ({ node, ...props }) => (
                                    <a
                                      {...props}
                                      style={{
                                        color: resolveColor(
                                          config.ui.primaryColor
                                        ),
                                      }}
                                      className="underline hover:opacity-80 transition-opacity"
                                    />
                                  ),
                                }}
                              >
                                {item.answer}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            item.answer
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            );
          })
        )}

        {/* Contact Section */}
        <div className="mt-12 pt-8 border-t border-zinc-200 text-center">
          <h2 className="text-lg font-semibold mb-2 text-zinc-900">
            Still have questions?
          </h2>
          <p className="text-sm text-zinc-600 mb-6">
            If you couldn&apos;t find the answer to your question, feel free to
            contact us.
          </p>
          <Button
            asChild
            size="xs"
            variant="primary"
            className="gap-1.5 text-xs"
            style={{ backgroundColor: resolveColor(config.ui.primaryColor) }}
          >
            <Link href="/about">
              Contact
              <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
