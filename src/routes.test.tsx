import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import { routes } from "./routes";

describe("routes", () => {
    function renderRouter(path: string) {
        const router = createMemoryRouter(routes, { initialEntries: [path] });
        render(<RouterProvider router={router} />);
    }
    test("when the current path is “/”", () => {
        renderRouter("/");
        const headerComponent = screen.getByTestId("header");
        expect(headerComponent).toBeInTheDocument();
    });

    test("when the current path is 'login' ", () => {
        renderRouter("/login");
        const email = screen.getByLabelText("Email");
        const password = screen.getByLabelText("Password");
        const loginButton = screen.getByText("Log in");
        expect(loginButton).toBeDisabled();

        fireEvent.change(email, { target: { value: "test123@naver.com" } });
        fireEvent.change(password, { target: { value: "test123" } });

        expect(loginButton).toBeEnabled();
    });
});
