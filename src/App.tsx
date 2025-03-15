import { IconAdjustment } from "justd-icons";
import { Options } from "./components/options";
import { Preview } from "./components/preview";
import { Button, buttonStyles, Drawer, Heading } from "./components/ui";
import { Worksheet } from "./components/worksheet/worksheet";

function App() {
  return (
    <main className="h-full">
      <div className="grid h-full grid-cols-3 print:hidden">
        <div className="px-auto col-span-3 flex flex-col items-center justify-center py-4 xl:col-span-2">
          <Heading level={1} tracking="widest" className="block py-4 xl:hidden">
            TERAKOYA
          </Heading>
          <Preview />
        </div>
        <div className="hidden p-4 xl:col-span-1 xl:block">
          <Heading
            level={1}
            tracking="widest"
            className="hidden py-4 text-center xl:block"
          >
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
        <div className="xl:hidden">
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
