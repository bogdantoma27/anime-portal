import { Pipe, PipeTransform } from "@angular/core";
import { Observable, interval, map } from "rxjs";

@Pipe({
  name: "nextBroadcast",
  standalone: true,
})
export class NextBroadcastPipe implements PipeTransform {
  private readonly DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private readonly JST_OFFSET = 9;
  private readonly BROADCAST_REGEX = /(\w+)s at (\d{2}:\d{2}) \(JST\)/;
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;
  private readonly MS_PER_HOUR = 1000 * 60 * 60;
  private readonly MS_PER_MINUTE = 1000 * 60;

  transform(broadcastString: string | undefined): Observable<string> {
    if (!broadcastString) {
      return interval(1000).pipe(map(() => ''));
    }

    return interval(1000).pipe(map(() => this.calculateNextBroadcast(broadcastString)));
  }

  private calculateNextBroadcast(broadcastString: string): string {
    const broadcastParts = broadcastString.match(this.BROADCAST_REGEX);
    if (!broadcastParts) return '';

    const [_, dayName, timeStr] = broadcastParts;
    const [broadcastHours, broadcastMinutes] = timeStr.split(':').map(Number);

    const localTime = this.convertJSTToLocal(broadcastHours, broadcastMinutes, dayName);
    if (!localTime) return '';

    const nextBroadcast = this.calculateNextBroadcastDate(
      localTime.hours,
      broadcastMinutes,
      localTime.dayIndex
    );

    return this.formatBroadcastTime(nextBroadcast);
  }

  private convertJSTToLocal(hours: number, minutes: number, dayName: string) {
    const localOffset = -(new Date().getTimezoneOffset() / 60);
    const hourDiff = this.JST_OFFSET - localOffset;

    let localHours = hours - hourDiff;
    let targetDay = this.DAYS.indexOf(dayName);

    if (localHours < 0) {
      localHours += 24;
      targetDay = (targetDay - 1 + 7) % 7;
    } else if (localHours >= 24) {
      localHours -= 24;
      targetDay = (targetDay + 1) % 7;
    }

    return { hours: localHours, dayIndex: targetDay };
  }

  private calculateNextBroadcastDate(hours: number, minutes: number, targetDay: number): Date {
    const now = new Date();
    let daysUntilBroadcast = (targetDay - now.getDay() + 7) % 7;

    if (daysUntilBroadcast === 0) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (currentHour > hours || (currentHour === hours && currentMinute >= minutes)) {
        daysUntilBroadcast = 7;
      }
    }

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilBroadcast,
      hours,
      minutes
    );
  }

  private formatBroadcastTime(nextBroadcast: Date): string {
    const now = new Date();
    const timeUntilBroadcast = nextBroadcast.getTime() - now.getTime();

    const remainingDays = Math.floor(timeUntilBroadcast / this.MS_PER_DAY);
    const remainingHours = Math.floor((timeUntilBroadcast % this.MS_PER_DAY) / this.MS_PER_HOUR);
    const remainingMinutes = Math.floor((timeUntilBroadcast % this.MS_PER_HOUR) / this.MS_PER_MINUTE);
    const remainingSeconds = Math.floor((timeUntilBroadcast % this.MS_PER_MINUTE) / 1000);

    const localDate = nextBroadcast.toLocaleDateString(undefined, { weekday: 'long' }) + 's';
    const localTime = nextBroadcast.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${localDate} ${localTime} (Local) - ${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
  }
}
