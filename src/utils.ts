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

  let array = [
    51678, 51679, 51680, 51681, 51682, 51683, 51684, 51685, 51686, 51687, 51688,
    51689, 51690, 51691, 51692, 51693, 51694, 51695, 51696, 51697, 51698, 51699,
    516700, 516700, 516701, 516702, 516703, 516704, 516705, 516706, 516707,
    516708, 516709, 516710, 516711, 516712, 516713, 516714, 516715, 516716,
    516717, 516718, 516719, 516720, 516721, 516722, 516723, 516724, 516725,
    516726, 516727, 516728, 516729, 516730, 516731, 516732, 516733, 516734,
    516735, 516736, 516737, 516738, 516739, 516740, 516741, 516742, 516743,
    516744, 516745, 516746, 516747, 516748,
  ];
  // var tot = 0;

  // for (let i = start; i >= start - end; i -= decrement) {
  //   array.push(i);
  //   tot = i;
  // }

  // const last = array[array.length - 1];
  // console.log(array[array.length - 1]);

  const res = await ctx.deleteMessages(array);
  console.log(res);
  // return last;
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
