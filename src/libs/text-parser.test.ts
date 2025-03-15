import { expect, test } from "vitest";
import { parse } from "./text-parser";

test("simple text", () => {
  expect(parse("吾輩は猫である。")).toStrictEqual([
    { text: "吾輩は猫である。", isBlank: false },
  ]);
});

// test("ruby 漢字((かんじ))", () => {
//   expect(
//     parse("吾輩((わがはい))は猫((ねこ))である。名前((なまえ))はまだ無い。"),
//   ).toStrictEqual([
//     { text: "吾輩", ruby: "わがはい", isBlank: false },
//     { text: "は", isBlank: false },
//     { text: "猫", ruby: "ねこ", isBlank: false },
//     { text: "である。", isBlank: false },
//     { text: "名前", ruby: "なまえ", isBlank: false },
//     { text: "はまだ無い。", isBlank: false },
//   ]);
// });

test("ruby ((漢字::かんじ))", () => {
  expect(
    parse(
      "((吾輩::わがはい))は((猫::ねこ))である。((名前::なまえ))はまだ無い。",
    ),
  ).toStrictEqual([
    { text: "吾輩", ruby: "わがはい", isBlank: false },
    { text: "は", isBlank: false },
    { text: "猫", ruby: "ねこ", isBlank: false },
    { text: "である。", isBlank: false },
    { text: "名前", ruby: "なまえ", isBlank: false },
    { text: "はまだ無い。", isBlank: false },
  ]);
});

// test("ruby mix", () => {
//   expect(
//     parse("吾((わが))輩((はい))は猫である。((名::な))((前::まえ))はまだ無い。"),
//   ).toStrictEqual([
//     { text: "吾", ruby: "わが", isBlank: false },
//     { text: "輩", ruby: "はい", isBlank: false },
//     { text: "は猫である。", isBlank: false },
//     { text: "名", ruby: "な", isBlank: false },
//     { text: "前", ruby: "まえ", isBlank: false },
//     { text: "はまだ無い。", isBlank: false },
//   ]);
// });

// test("ruby mix 2", () => {
//   expect(
//     parse("((吾::わが))輩((はい))は猫である。名((な))((前::まえ))はまだ無い。"),
//   ).toStrictEqual([
//     { text: "吾", ruby: "わが", isBlank: false },
//     { text: "輩", ruby: "はい", isBlank: false },
//     { text: "は猫である。", isBlank: false },
//     { text: "名", ruby: "な", isBlank: false },
//     { text: "前", ruby: "まえ", isBlank: false },
//     { text: "はまだ無い。", isBlank: false },
//   ]);
// });

test("ruby connection", () => {
  expect(parse("親((譲::ゆず))り")).toStrictEqual([
    { text: "親", isBlank: false },
    { text: "譲", ruby: "ゆず", isBlank: false },
    { text: "り", isBlank: false },
  ]);
});

test("blank", () => {
  expect(parse("[[吾輩]]は[[猫]]である")).toStrictEqual([
    { text: "吾輩", isBlank: true, hint: undefined },
    { text: "は", isBlank: false },
    { text: "猫", isBlank: true, hint: undefined },
    { text: "である", isBlank: false },
  ]);
});

test("blank", () => {
  expect(parse("[[吾輩::わがはい]]は[[猫::ねこ]]である")).toStrictEqual([
    { text: "吾輩", isBlank: true, hint: "わがはい" },
    { text: "は", isBlank: false },
    { text: "猫", isBlank: true, hint: "ねこ" },
    { text: "である", isBlank: false },
  ]);
});
