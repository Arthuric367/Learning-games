import trexImg from '../assets/pronoun_adventure/trex_standing_1763828050004.png';
import carImg from '../assets/pronoun_adventure/dino_driving_1763828073298.png';
import ballImg from '../assets/pronoun_adventure/dino_playing_ball_1763828204529.png';
import friendsImg from '../assets/pronoun_adventure/dino_friends.png';
import houseImg from '../assets/pronoun_adventure/dino_house.png';
import pizzaImg from '../assets/pronoun_adventure/dino_pizza.png';
import toyImg from '../assets/pronoun_adventure/dino_toy.png';
import helpImg from '../assets/pronoun_adventure/dino_help.png';
import happyImg from '../assets/pronoun_adventure/dino_happy.png';
import comeImg from '../assets/pronoun_adventure/dino_come.png';
import nameTagImg from '../assets/pronoun_adventure/dino_name_tag.png';
import lookMeImg from '../assets/pronoun_adventure/dino_look_me.png';
import treeImg from '../assets/pronoun_adventure/big_tree.png';
import birdImg from '../assets/pronoun_adventure/bird_wing.png';
import iceCreamImg from '../assets/pronoun_adventure/dino_icecream.png';
import iceCreamVideo from '../assets/pronoun_adventure/Dinosaur_Ice_Cream.mp4';

export const questions = [
  {
    id: 1,
    text: "___ am a T-Rex.",
    options: ["I", "My", "Me"],
    answer: "I",
    image: trexImg,
    audioText: "I am a T-Rex.",
    hint: "Subject (Who?)"
  },
  {
    id: 2,
    text: "___ car is red.",
    options: ["I", "My", "Me"],
    answer: "My",
    image: carImg,
    audioText: "My car is red.",
    hint: "Possessive (Whose?)"
  },
  {
    id: 3,
    text: "Give the ball to ___.",
    options: ["I", "My", "Me"],
    answer: "Me",
    image: ballImg,
    audioText: "Give the ball to me.",
    hint: "Object (To whom?)"
  },
  {
    id: 4,
    text: "___ are friends.",
    options: ["We", "Our", "Us"],
    answer: "We",
    image: friendsImg,
    audioText: "We are friends.",
    hint: "Subject (Who?)"
  },
  {
    id: 5,
    text: "This is ___ house.",
    options: ["We", "Our", "Us"],
    answer: "Our",
    image: houseImg,
    audioText: "This is our house.",
    hint: "Possessive (Whose?)"
  },
  {
    id: 6,
    text: "___ like pizza.",
    options: ["I", "My", "Me"],
    answer: "I",
    image: pizzaImg,
    audioText: "I like pizza.",
    hint: "Subject"
  },
  {
    id: 7,
    text: "This is ___ toy.",
    options: ["You", "Your", "You're"],
    answer: "Your",
    image: toyImg,
    audioText: "This is your toy.",
    hint: "Possessive"
  },
  {
    id: 8,
    text: "Can ___ help me?",
    options: ["You", "Your", "My"],
    answer: "You",
    image: helpImg,
    audioText: "Can you help me?",
    hint: "Subject"
  },
  {
    id: 9,
    text: "___ are happy.",
    options: ["We", "Us", "Our"],
    answer: "We",
    image: happyImg,
    audioText: "We are happy.",
    hint: "Subject"
  },
  {
    id: 10,
    text: "Come with ___.",
    options: ["We", "Us", "Our"],
    answer: "Us",
    image: comeImg,
    audioText: "Come with us.",
    hint: "Object"
  },
  {
    id: 11,
    text: "___ name is Dino.",
    options: ["I", "My", "Me"],
    answer: "My",
    image: nameTagImg,
    audioText: "My name is Dino.",
    hint: "Possessive"
  },
  {
    id: 12,
    text: "Look at ___!",
    options: ["I", "My", "Me"],
    answer: "Me",
    image: lookMeImg,
    audioText: "Look at me!",
    hint: "Object"
  },
  {
    id: 13,
    text: "___ is a big tree.",
    options: ["It", "Its", "I"],
    answer: "It",
    image: treeImg,
    audioText: "It is a big tree.",
    hint: "Subject"
  },
  {
    id: 14,
    text: "The bird hurts ___ wing.",
    options: ["It", "Its", "It's"],
    answer: "Its",
    image: birdImg,
    audioText: "The bird hurts its wing.",
    hint: "Possessive"
  },
  {
    id: 15,
    text: "___ love ice cream!",
    options: ["We", "Our", "Us"],
    answer: "We",
    image: iceCreamImg,
    video: iceCreamVideo,
    poster: iceCreamImg,
    audioText: "We love ice cream!",
    hint: "Subject"
  }
];
