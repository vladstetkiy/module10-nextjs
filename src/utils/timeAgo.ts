function timeAgo(timestamp: string | Date | number | undefined, language: 'en' | 'ru'): string {
  const now = new Date();
  const past = new Date(timestamp ? timestamp : 0);
  const diffInMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (language === 'en') {
    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 10) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  if (language === 'ru') {
    const getRussianForm = (number: number, words: [string, string, string]) => {
      if (number % 10 === 1 && number % 100 !== 11) return words[0];
      if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20))
        return words[1];
      return words[2];
    };

    if (years > 0) {
      const form = getRussianForm(years, ['год', 'года', 'лет']);
      return `${years} ${form} назад`;
    }
    if (months > 0) {
      const form = getRussianForm(months, ['месяц', 'месяца', 'месяцев']);
      return `${months} ${form} назад`;
    }
    if (weeks > 0) {
      const form = getRussianForm(weeks, ['неделя', 'недели', 'недель']);
      return `${weeks} ${form} назад`;
    }
    if (days > 0) {
      const form = getRussianForm(days, ['день', 'дня', 'дней']);
      return `${days} ${form} назад`;
    }
    if (hours > 0) {
      const form = getRussianForm(hours, ['час', 'часа', 'часов']);
      return `${hours} ${form} назад`;
    }
    if (minutes > 0) {
      const form = getRussianForm(minutes, ['минута', 'минуты', 'минут']);
      return `${minutes} ${form} назад`;
    }
    if (seconds > 10) {
      const form = getRussianForm(seconds, ['секунда', 'секунды', 'секунд']);
      return `${seconds} ${form} назад`;
    }
    return 'только что';
  }

  return 'just now';
}

export default timeAgo;
