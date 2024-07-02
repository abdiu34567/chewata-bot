import { Context } from "telegraf";
import { UserController } from "./db";
import { getDb } from "./db/config";
import * as translations from "../assets/translation.json";
import {
  invite,
  inviteAmharic,
  language,
  mainMenu,
  mainMenuAmharic,
} from "./keyboards";

export const translate = async (ctx: Context) => {
  const message = ctx.message as { text: string };
  const text = message?.text;

  // if(language === "am"){
  // return translations[]
  // }
};

export const deleter = async (ctx: Context, start: number) => {
  // let start = 51542;
  let end = 50;
  let decrement = 1; // Adjust this to change the step size if needed

  let array = [];

  for (let i = start; i >= start - end; i -= decrement) {
    array.push(i);
  }

  console.log(array);

  const last = array[array.length - 1];
  // console.log(array[array.length - 1]);

  const res = await ctx.deleteMessages(array);
  console.log("response: ", res);
  console.log(`next ${start}: `, start - end);
  return start - end;
};

export const getLanguage = async (tgId: string) => {
  const db = getDb();
  const userController = new UserController(db);

  const user = await userController.queryUser({ tgId });
  return user?.language || "en"; //default is english
};

export const setlanguage = async (tgId: string, language: string) => {
  const db = getDb();
  const userController = new UserController(db);
  const user = (await userController.updateLanguage({ tgId, language })) as any;
  return user?.language || "en"; //default is english
};

export const getMainMenu = async (language: string) => {
  return language === "am" ? mainMenuAmharic : mainMenu;
};

export const getInviteLink = async (language: string) => {
  return language === "am" ? inviteAmharic : invite;
};
