import React, {FC} from "react";
import "./About.scss";

const About: FC = () => {
  return (
    <div className="about-main-container">
      <span className="headline">Добро пожаловать на наш сайт!</span>
      <p>
        Хотите приобрести кондитерские изделия в городе Кемерово?
        В таком случае, вы попали точно по адресу!
        Ведь мы знаем: когда нужны вкусные кондитерские изделия – мы стараемся выбирать все самое лучшее, без каких-либо компромиссов.
      </p>
      <p>
        Без чего нельзя представить современный праздничный стол, предстоящие новогодние праздники, подарки детям?
        Подарок для родителей, любимой девушки,
        лучшего друга или хорошего сотрудника, новый год,
        оригинальный подарок на день рождения, выбранный с любовью,
        поможет усилить радость и будет служить прекрасным напоминанием об этом замечательном моменте.
      </p>
    </div>
  );
};

export default About;