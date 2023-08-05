import React from "react";
import {render} from "@testing-library/react";
import Product from "./Product";
import {unmountComponentAtNode} from "react-dom";

let container: HTMLDivElement | null = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  if (!container) {
    return;
  }
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('render product card', async () => {
  const {getByText} = render(
    <Product
      product={{
        id: 145,
        image: '',
        image_mini: '',
        name: 'test_render_name',
        composition: 'test_render_composition',
        manufacturer: 'test_render_manufacturer',
        description: 'test_render_description',
        product_unit: 'test_render_product_unit',
        categories: [],
      }}
    />
  );

  expect(getByText(/test_render_name/i)).toBeInTheDocument();
  expect(getByText(/test_render_composition/i)).toBeInTheDocument();
  expect(getByText(/test_render_manufacturer/i)).toBeInTheDocument();
  expect(getByText(/test_render_product_unit/i)).toBeInTheDocument();
});

test('render product card only name', async () => {
  const {getByText} = render(
    <Product
      product={{
        id: 145,
        image: '',
        image_mini: '',
        name: 'test_render_name',
        composition: null,
        manufacturer: null,
        description: null,
        product_unit: null,
        categories: [],
      }}
    />
  );

  expect(getByText(/test_render_name/i)).toBeInTheDocument();
});
