import React, {FC, PropsWithChildren, useEffect} from "react";
import {Provider} from "react-redux";
import {store} from "../../../redux/store";
import Notifications from "./Notifications";
import {useAppDispatch} from "../../../redux/hooks";
import { addNotification } from "../../../redux/slices/notificationsSlice";
import {unmountComponentAtNode} from "react-dom";
import {createRoot, Root} from "react-dom/client";
import {act} from "react-dom/test-utils";

let container: HTMLDivElement | null = null;
let root: Root | null = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  if (!root || !container) {
    throw(new Error('can\'t create root or container'));
  }
});
afterEach(() => {
  if (!container || !root) {
    return;
  }
  root.unmount();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  root = null;
});

test('render notifications', async () => {
  const PrepareStoreByHooks: FC<PropsWithChildren> = (props) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
      dispatch(
        addNotification({
          type: 'info',
          message: 'test_render_notification'
        })
      );
    }, []);
    return (
      <>
        {props.children}
      </>
    );
  }

  await act(() => {
    root?.render(
      <Provider store={store}>
        <PrepareStoreByHooks>
          <Notifications/>
        </PrepareStoreByHooks>
      </Provider>
    );
  });
  expect(container?.textContent).toContain('test_render_notification');
});
