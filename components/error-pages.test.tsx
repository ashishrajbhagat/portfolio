// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";
import GlobalError from "@/app/global-error";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("error page", () => {
  it("offers a retry and a way home, and logs the error", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    const error = Object.assign(new Error("boom"), { digest: "abc123" });
    render(<ErrorPage error={error} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Back to profiles" }).getAttribute("href")).toBe("/");
    expect(screen.getByText("Reference: abc123")).toBeTruthy();
    expect(log).toHaveBeenCalledWith(error);
  });

  it("keeps the running joke", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorPage error={new Error("boom")} reset={() => {}} />);
    expect(screen.getByText(/It was working on my system/)).toBeTruthy();
  });

  it("does not show a reference when there is no digest", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorPage error={new Error("boom")} reset={() => {}} />);
    expect(screen.queryByText(/Reference:/)).toBeNull();
  });
});

describe("global error page", () => {
  it("renders a full document (it replaces the whole page) with a working retry button", () => {
    const reset = vi.fn();
    const tree = GlobalError({ error: Object.assign(new Error("boom"), { digest: "d1" }), reset }) as ReactElement<{ children?: ReactNode }>;
    expect(tree.type).toBe("html");

    const markup = renderToStaticMarkup(tree);
    expect(markup).toContain("Something went wrong.");
    expect(markup).toContain("Reference: d1");

    // Find the retry button in the element tree and click it.
    const button = findElement(tree, "button");
    expect(button).not.toBeNull();
    (button!.props as { onClick: () => void }).onClick();
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

function findElement(node: ReactNode, type: string): ReactElement | null {
  if (!isValidElement(node)) return null;
  if (node.type === type) return node;
  const children = (node.props as { children?: ReactNode }).children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const found = findElement(child, type);
    if (found) return found;
  }
  return null;
}
