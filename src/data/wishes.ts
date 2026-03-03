export const wishes: string[] = [
  "Em là điều tuyệt vời nhất đến với cuộc đời anh. Chúc em ngày 8/3 thật hạnh phúc! 💕",
  "Cảm ơn em vì đã luôn bên cạnh, yêu thương và chăm sóc gia đình mình. Anh yêu em! 🌹",
  "Em là ánh nắng soi sáng mỗi ngày của anh. Happy Women's Day, vợ yêu! ☀️",
  "Không lời nào đủ để diễn tả tình yêu anh dành cho em. Chúc em mãi xinh đẹp và rạng rỡ! 🌸",
  "Em là người phụ nữ tuyệt vời nhất thế giới trong mắt anh. Happy 8/3! 👑",
  "Mỗi ngày bên em là một ngày đáng nhớ. Cảm ơn em vì tất cả, vợ yêu! 💝",
  "Em xứng đáng được nhận tất cả những điều tốt đẹp nhất. Chúc em ngày 8/3 an lành! 🌺",
  "Anh hứa sẽ luôn yêu em, che chở em và làm em mỉm cười mỗi ngày! 💗",
  "Em là bông hoa đẹp nhất trong vườn đời anh. Happy Women's Day! 🌷",
  "Cảm ơn em đã cho anh một mái ấm hạnh phúc. Yêu em nhiều lắm! 🏡💕",
  "Em không chỉ là vợ, em còn là bạn thân, là tri kỷ của anh. Chúc em luôn vui! 💞",
  "Ngày 8/3 này, anh muốn nói: Em là tất cả của anh! I love you! ❤️",
  "Nụ cười của em là động lực lớn nhất để anh cố gắng mỗi ngày. Yêu em! 😊💕",
  "Em là người phụ nữ mạnh mẽ, dịu dàng và đáng ngưỡng mộ nhất. Happy 8/3! 💪🌹",
  "Cuộc sống có em thật ý nghĩa và trọn vẹn. Cảm ơn em, vợ yêu! 🌟",
  "Anh sẽ luôn ở bên em, dù nắng hay mưa, dù vui hay buồn. Yêu em mãi! 🌈",
  "Em là nữ hoàng của trái tim anh. Chúc em ngày Quốc tế Phụ nữ thật đặc biệt! 👸",
  "Mỗi khoảnh khắc bên em đều là khoảnh khắc hạnh phúc. I love you 3000! 💕",
  "Em xinh đẹp từ bên trong lẫn bên ngoài. Anh tự hào vì có em! 🌹✨",
  "Chúc em luôn khỏe mạnh, luôn tươi trẻ và luôn là chính mình. Happy 8/3! 🎀",
  "Anh biết ơn vũ trụ đã để anh gặp em. Em là món quà quý giá nhất! 🎁",
  "Ngày 8/3, anh chỉ muốn ôm em thật chặt và nói: Cảm ơn em vì đã là em! 🤗",
  "Em là lý do anh tin vào tình yêu đích thực. Happy Women's Day, my love! 💘",
  "Dù thế giới có thay đổi, tình yêu anh dành cho em sẽ mãi vẹn nguyên! 🌍❤️",
];

export const getWishByHour = (): string => {
  const hour = new Date().getHours();
  return wishes[hour % wishes.length];
};

export const getRandomWish = (): string => {
  return wishes[Math.floor(Math.random() * wishes.length)];
};
