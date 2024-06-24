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
