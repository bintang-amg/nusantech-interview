import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("calls onChange as the user types", async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole("searchbox"), "dune");

    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange).toHaveBeenLastCalledWith("e");
  });

  it("submits the current value", async () => {
    const onSearch = vi.fn();
    const onChange = vi.fn();

    function Wrapper() {
      const [value, setValue] = useState("matrix");
      return (
        <SearchBar
          value={value}
          onChange={(next) => {
            setValue(next);
            onChange(next);
          }}
          onSearch={onSearch}
        />
      );
    }

    render(<Wrapper />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "{enter}");

    expect(onSearch).toHaveBeenCalledWith("matrix");
  });

  it("clears the search when the clear button is used", async () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    render(<SearchBar value="alien" onChange={onChange} onSearch={onSearch} />);

    await userEvent.click(screen.getByRole("button", { name: /clear search/i }));

    expect(onChange).toHaveBeenCalledWith("");
    expect(onSearch).toHaveBeenCalledWith("");
  });
});
