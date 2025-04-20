import { Button } from "@heroui/react";
import { Options } from "./components/options";
import { OptionsDrawer } from "./components/options/options-drawer";
import { Preview } from "./components/preview";
import { Heading } from "./components/ui";
import { Worksheet } from "./components/worksheet/worksheet";

function App() {
  return (
    <>
      <div className="grid h-full grid-cols-3 grid-rows-1 overflow-hidden print:hidden">
        <div className="col-span-3 row-span-1 grid size-full grid-cols-1 grid-rows-15 overflow-hidden md:col-span-2">
          <Heading
            level={1}
            tracking="widest"
            className="row-span-1 flex items-center justify-center pt-4 md:hidden"
          >
            TERAKOYA
          </Heading>
          <Preview className="row-span-14 md:row-span-15 md:my-0" />
        </div>
        <div className="hidden overflow-y-scroll p-4 md:col-span-1 md:block">
          <Heading level={1} tracking="widest" className="pb-4 text-center">
            TERAKOYA
          </Heading>
          <Options intent="cards" />
          <Button
            onPress={() => {
              print();
            }}
            color="primary"
            className="my-4 w-full"
          >
            印刷する
          </Button>
        </div>
        <div className="md:hidden">
          <OptionsDrawer />
        </div>
      </div>
      <div className="hidden print:block">
        <Worksheet />
      </div>
    </>
  );
}

export default App;
