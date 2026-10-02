import { flushSync } from "react-dom";
import { useNavigate } from "react-router";

/**
 * react-router v7's built-in `viewTransition` prop on <Link>/navigate only
 * works with the data router (createBrowserRouter + RouterProvider). This
 * app uses declarative <BrowserRouter>/<Routes>, where that prop is a
 * silent no-op — see https://github.com/remix-run/react-router/issues/12792
 *
 * This hook drives document.startViewTransition() manually instead, so
 * the login <-> signup crossfade works regardless of router mode.
 *
 * flushSync is required because React 18+ batches state updates
 * asynchronously, but startViewTransition needs the DOM to have already
 * been updated by the time its callback resolves in order to capture an
 * accurate "after" snapshot.
 */
export function useTransitionNavigate() {
  const navigate = useNavigate();

  return (to: string) => {
    if (!document.startViewTransition) {
      // Unsupported browser (e.g. older Firefox): plain navigation, no animation, no error.
      navigate(to);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        navigate(to);
      });
    });
  };
}
