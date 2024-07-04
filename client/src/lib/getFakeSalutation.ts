const salutations: string[][] = [["Hello handsome! I was waiting for you.", "How's your day treating you?"], ["Hey there sexy! How's your day going?"], ["Hey there :) How can I satisfy your naughty desires today?"]];

export const getFakeSalutation = () => {
  return salutations[Math.floor(Math.random() * salutations.length)];
};