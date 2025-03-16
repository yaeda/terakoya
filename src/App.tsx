import { IconAdjustment } from "justd-icons";
import { Options } from "./components/options";
import { Preview } from "./components/preview";
import { Button, buttonStyles, Drawer, Heading } from "./components/ui";
import { Worksheet } from "./components/worksheet/worksheet";

function App() {
  return (
    <main className="h-full">
      <div className="grid h-full grid-cols-3 grid-rows-1 overflow-hidden print:hidden">
        <div className="col-span-3 row-span-1 grid size-full grid-cols-1 grid-rows-12 overflow-hidden md:col-span-2">
          <Heading
            level={1}
            tracking="widest"
            className="row-span-1 flex items-center justify-center py-4 md:hidden"
          >
            TERAKOYA
          </Heading>
          <Preview className="row-span-11 -my-4 md:row-span-12 md:my-0" />
        </div>
        <div className="hidden p-4 md:col-span-1 md:block">
          <Heading level={1} tracking="widest" className="py-4 text-center">
            TERAKOYA
          </Heading>
          <Options intent="cards" />
          <Button
            onPress={() => {
              print();
            }}
            intent="primary"
            className="my-4 w-full"
          >
            印刷する
          </Button>
        </div>
        <div className="md:hidden">
          <Drawer withNotch={false}>
            <Drawer.Trigger
              className={buttonStyles({
                shape: "circle",
                intent: "primary",
                class: "fixed right-4 bottom-4",
              })}
            >
              <IconAdjustment />
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>各種設定</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Options intent="tabs" />
              </Drawer.Body>
              <Drawer.Footer>
                <Button
                  onPress={() => {
                    print();
                  }}
                  intent="primary"
                  className="w-full"
                >
                  印刷する
                </Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer>
        </div>
      </div>
      <div className="hidden print:block">
        <Worksheet />
      </div>
    </main>
  );
}

export default App;
