"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { GetProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductDetailsProps {
  invocation: GetProductDetailsToolInvocation;
}

export function AgentProductDetails({ invocation }: AgentProductDetailsProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    const idOrSlug = invocation.input?.idOrSlug;
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Looking up{idOrSlug ? ` "${idOrSlug}"` : " product"}…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;
  if (!output) return null;

  if ("error" in output && output.error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  const product = output.product;
  if (!product) return null;

  const [image, ...extraImages] = product.images;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-secondary/50"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-md bg-secondary">
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div>
            <h3 className="text-sm font-semibold leading-tight">
              {product.name}
            </h3>
            <p className="text-xs capitalize text-muted-foreground">
              {product.category}
            </p>
          </div>
          <p className="text-sm font-medium">
            {formatPrice(product.price, product.currency)}
          </p>
          {product.description && (
            <p className="line-clamp-3 text-xs text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>
      </div>
      {extraImages.length > 0 && (
        <div className="flex gap-2 border-t border-border bg-secondary/20 p-3">
          {extraImages.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className="relative h-12 w-12 overflow-hidden rounded-md bg-secondary"
            >
              <Image
                src={img}
                alt={`${product.name} view ${i + 2}`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
