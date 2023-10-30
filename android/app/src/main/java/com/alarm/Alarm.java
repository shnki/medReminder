package com.alarm;

import android.graphics.Bitmap;
import android.util.Log;

import com.google.gson.Gson;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;


public class Alarm implements Cloneable {

    int initialMinute;
    int initialHour;
    int often ;
    String many ;

    ArrayList<Integer> times;
    String uid;
    ArrayList<Integer> days;
    int hour;
    int minutes;
    int snoozeInterval;
    String title;
    String description;
    boolean repeating;
    boolean active;


    String uri;



    Bitmap bitmap;

    Alarm(String uid, ArrayList<Integer> days, int hour, int minutes, int snoozeInterval, String title, String description, boolean repeating, boolean active , String uri ,  ArrayList<Integer> times , int initialHour , int initialMinute, String many ,int often) {
        this.uid = uid;
        this.days = days;
        this.hour = hour;
        this.minutes = minutes;
        this.snoozeInterval = snoozeInterval;
        this.title = title;
        this.description = description;
        this.repeating = repeating;
        this.active = active;
        this.uri = uri;
        this.times = times;
        this.initialHour= initialHour;
        this.initialMinute= initialMinute;
        this.often = often;
        this.many= many;
    }

    Date[] getDates() {
        Date[] dates = new Date[times.size()];
        for (int i = 0; i < times.size(); i++) {
            dates[i] = new Date(times.get(i) * 1000L);

        }
        return dates;
    }


     Bitmap getBitmap() {
        return bitmap;
    }

    AlarmDates getAlarmDates() {
        return new AlarmDates(uid, getDates());
    }

    static Alarm fromJson(String json) {
        return new Gson().fromJson(json, Alarm.class);
    }

    static String toJson(Alarm alarm) {
        return new Gson().toJson(alarm);
    }

    public Alarm clone () throws CloneNotSupportedException {
        return (Alarm) super.clone();
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (!(o instanceof Alarm)) return false;
        Alarm alarm = (Alarm)o;
        return (
                this.hour == alarm.hour &&
                this.minutes == alarm.minutes &&
                this.snoozeInterval == alarm.snoozeInterval &&
                this.uid.equals(alarm.uid) &&
                this.days.equals(alarm.days) &&
                this.title.equals(alarm.title) &&
                this.description.equals(alarm.description)
        );
    }
}
