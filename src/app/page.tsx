"use client";

import { RefObject, createRef, useEffect, useRef, useState } from "react";

export default function Home() {
  const [corpNumber, setCorpNumber] = useState("");
  const [chkDigit, setChkDigit] = useState("");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [alert, setAlert] = useState(false);
  const [link, setLink] = useState("");
  const numbers = ["", "", "", "", "", "", "", "", "", "", "", ""];
  const numberRefs = useRef<RefObject<HTMLInputElement>[]>([]);

  numbers.forEach((_, index) => {
    if (numberRefs.current[index] === undefined) {
      numberRefs.current[index] = createRef<HTMLInputElement>();
    }
  });

  useEffect(() => {
    numberRefs.current[0].current!.focus();
  }, []);

  const clearNum = (index: number) => {
    numberRefs.current[index].current!.value = "";
  };

  const clearAll = () => {
    numberRefs.current.forEach((ref) => {
      ref.current!.value = "";
    });
    numberRefs.current[0].current!.focus();
    setChkDigit("");
    setCorpNumber("");
    setReady(false);
    setAlert(false);
    setCopied(false);
    setLink("");
  };

  const setNum = (index: number, value: string) => {
    if (isNaN(Number(value))) {
      setAlert(true);
      numberRefs.current[index].current!.value = "";
    } else {
      setAlert(false);
      if (numberRefs.current[index].current!.value.length >= 1) {
        if (index < numbers.length - 1) {
          numberRefs.current[index + 1].current!.focus();
        }
      }

      generate();
    }
  };

  const copyToClipboard = async () => {
    const text = chkDigit + corpNumber;
    setCopied(true);
    await global.navigator.clipboard.writeText(text);
  };

  const copyFromClipboard = async () => {
    const text = await global.navigator.clipboard.readText();
    console.log(text);
    text.split("").forEach((num, index) => {
      if (isNaN(Number(num))) {
        setAlert(true);
      } else if (index < numbers.length) {
        numberRefs.current[index].current!.value = num;
      }
    });
    generate();
  };

  const generate = () => {
    const result = numberRefs.current.every(
      (ref) => ref.current!.value.length > 0
    );

    if (result) {
      const nums = numberRefs.current.map((ref) => Number(ref.current!.value));

      const even_sum =
        nums[0] + nums[2] + nums[4] + nums[6] + nums[8] + nums[10];
      const odd_sum =
        nums[1] + nums[3] + nums[5] + nums[7] + nums[9] + nums[11];
      const sum = even_sum * 2 + odd_sum;
      const rest = sum % 9;
      const chk_digit = 9 - rest;
      setChkDigit(chk_digit.toString());
      setCorpNumber(nums.join(""));
      setReady(true);
      setLink(
        `https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=${chk_digit}${nums.join(
          ""
        )}`
      );
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 h-screen w-screen flex flex-col justify-center items-center">
      <div className="py-8 px-4 mx-auto text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          法人番号Generator
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
          12桁の法人番号からチェックデジットを生成し、13桁の法人番号にします
        </p>
      </div>
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center">
        <form>
          <div className="flex gap-8">
            {numbers.map((num, index) => (
              <input
                type="text"
                key={index}
                ref={numberRefs.current[index]}
                onChange={(e) => setNum(index, e.target.value)}
                className="font-bold text-5xl text-center bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                maxLength={1}
                required
              />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center">
            {alert && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">数値しか入力できません</span>
              </div>
            )}
          </div>
        </form>
      </div>
      <div>
        <button
          type="button"
          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={() => copyFromClipboard()}
        >
          Clipboard読み込み
        </button>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => clearAll()}
        >
          Clear
        </button>
      </div>

      <div className="my-8">
        <svg
          className="w-12 h-12 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 1v12m0 0 4-4m-4 4L1 9"
          />
        </svg>
      </div>
      {ready && (
        <div className="mt-8 w-1/2 h-16 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="text-5xl pr-4 tracking-widest text-red-500">
              {chkDigit}
            </div>
            <div className="text-5xl pr-8 tracking-widest">{corpNumber}</div>
            <div className="" onClick={() => copyToClipboard()}>
              <svg
                className="w-8 h-8 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m7.708 2.292.706-.706A2 2 0 0 1 9.828 1h6.239A.97.97 0 0 1 17 2v12a.97.97 0 0 1-.933 1H15M6 5v4a1 1 0 0 1-1 1H1m11-4v12a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V9.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 5h5.239A.97.97 0 0 1 12 6Z"
                />
              </svg>
            </div>
            <div>
              {copied && (
                <div
                  className="ml-4 p-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                  role="alert"
                >
                  <span className="font-medium">Copied</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <a
              href={link}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              国税庁の法人情報公表サイトへのリンクはこちら
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
