package com.alarm;

import android.util.Log;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;

public class AlarmDates {

    private static final String postfix = "_DATES";
    String uid;
    String alarmUid;
    Date[] dates;
    int[] notificationIds;
    private static int EVERY_DAY = 0 ;
    private static int EVERY_OTHER_DAY = 1 ;
    private static int SPECIFIC_DAYS_OF_THE_WEEK = 2 ;
    private static int EVERY_X_DAYS = 3 ;

    private static String TAG = "AlarmDates";

    public AlarmDates (String alarmUid, Date[] dates) {
        this.uid = alarmUid + postfix;
        this.alarmUid = alarmUid;
        this.dates = dates;
        this.notificationIds = new int[dates.length];
        for (int i = 0; i < dates.length; i++) {
            this.notificationIds[i] = randomId();
        }
    }

    public static String getDatesId (String alarmUid) {
        return alarmUid + postfix;
    }

    public static long toUnixTimeStamp(Date date){
        return date.getTime() / 1000;

    }


    public int getNotificationId (Date date) {
        for (int i = 0; i < dates.length; i++) {
            if (dates[i].equals(date)) {
                return notificationIds[i];
            }
        }
        return -1;
    }

    public static Date setNextTime(Date date, Alarm alarm) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        Log.w("alarm.often:",alarm.often + "");



        if(alarm.often == EVERY_DAY){
            calendar.add(Calendar.DATE, 1);
            Log.w("alarm.often:is SET TO","EVERY_DAY");




        }
        if(alarm.often == EVERY_OTHER_DAY){
            calendar.add(Calendar.DATE, 2);
            Log.w("alarm.often:is SET TO","EVERY_OTHER_DAY");



        }

        if(alarm.often == SPECIFIC_DAYS_OF_THE_WEEK){
            int SpaceDay = getNextSpaceDay(convertArrayListToPrimitiveArray(alarm.days));
            calendar.add(Calendar.DATE, SpaceDay);
            Log.d("Specific Days:SpaceDay:",SpaceDay + "");
        }
        if(alarm.often == EVERY_X_DAYS){
            calendar.add(Calendar.DATE, alarm.often);
            Log.d("EVERY_X_DAYS",alarm.often + "");

        }
        Log.w("alarm.often:NewCalendar",calendar.getTime()+"");

        return calendar.getTime();
    }

    private static int getTodaysDayNumber(){
        Calendar calendar = Calendar.getInstance();
        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK) - 1;
        return  dayOfWeek ;
    }

    private static boolean isLastElement(int[] arr, int el) {
        return arr[arr.length - 1] == el;
    }

    private static int getNextSpaceDay(int[] days) {
        int today = getTodaysDayNumber();
        for (int i = 0; i < days.length; i++) {
            if (isLastElement(days, today)) {
                return (days[0] + 7) - today;
            }
            if (days[i] == today) {
                return days[i + 1] - days[i];
            }
        }
        return -1;
    }
    private static int[] convertArrayListToPrimitiveArray(ArrayList<Integer> arrayList) {
        int count = arrayList.size();
        int[] result = new int[count];
        for (int i = 0; i < count; i++) {
            result[i] = arrayList.get(i);
        }
        return result;
    }

    public static Date snooze (Date date, int minutes) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, minutes);
        return calendar.getTime();
    }

    public static boolean isDatesId (String id) {
        return id.contains(postfix);
    }

    public int getCurrentNotificationId () {
        Date current = getCurrentDate();
        return getNotificationId(current);
    }

    public Date getCurrentDate () {
        Calendar calendar = Calendar.getInstance();
        int currentDay = calendar.get(Calendar.DAY_OF_WEEK);
        for (Date date : dates) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            if (cal.get(Calendar.DAY_OF_WEEK) == currentDay) {
                return date;
            }
        }
        return null;
    }

    public ArrayList<Date> getDates () {
        return new ArrayList<>(Arrays.asList(dates));
    }

    public void update (Date old, Date updated) {
        for (int i = 0; i < dates.length; i++) {
            if (dates[i].equals(old)) {
                Log.d(TAG,"update in AlarmDates.java- found OldDate: "+dates[i] +"replaced with: "+updated);
                dates[i] = updated;
                return;
            }
        }
    }

    public static AlarmDates fromJson (String json) {
        return new Gson().fromJson(json, AlarmDates.class);
    }

    public static String toJson (AlarmDates dates) {
        return new Gson().toJson(dates);
    }

    private static int randomId () {
        return (int)(Math.random() * 10000000);
    }
}
