package com.alarm;

import android.content.Context;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.util.Log;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

public class Manager {

    private static final String TAG = "AlarmManager";
    private static Sound sound;
    private static String activeAlarmUid;
    private static  TextToSpeech mTts;

    static String getActiveAlarm() {
        return activeAlarmUid;
    }

    static void schedule(Context context, Alarm alarm) {
        AlarmDates dates = alarm.getAlarmDates();
        createSoundFile(context, alarm);

        for (Date date : dates.getDates()) {
            Helper.scheduleAlarm(context, alarm.uid, date.getTime(), dates.getNotificationId(date));
            Log.d(TAG,"this the time "+date.getTime());
        }
        Storage.saveAlarm(context, alarm);
        Storage.saveDates(context, dates);
    }

    private static void createSoundFile(Context context, Alarm alarm) {
        mTts = new TextToSpeech(context, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    String text = alarm.title;
                    String filename = alarm.uid + ".mp3";
                    HashMap<String, String> params = new HashMap<>();
                    params.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, text);
                    mTts.setVoice(new Voice("en-us-x-sfg#male_1-local", new Locale("en", "US"), Voice.QUALITY_HIGH, Voice.LATENCY_NORMAL, false, null));
                    mTts.synthesizeToFile(text, params, context.getFilesDir().getAbsolutePath() + "/" + filename);
                    Log.d(TAG, context.getFilesDir().getAbsolutePath() + "/" + filename+ "");
                }
            }
        });
    }

    public static void reschedule(Context context) {
        Alarm[] alarms = Storage.getAllAlarms(context);

        for(Alarm alarm : alarms){
            ArrayList<Integer> times = alarm.times;
            for(int time : times ){
                Log.w(TAG,"times Item : "+time + " now timeStamp: " +(int) AlarmDates.toUnixTimeStamp(new Date()) );
                if(time < (int)AlarmDates.toUnixTimeStamp(new Date()) ){
                    Log.w(TAG,"found old passed Alarm: "+ time +" now time is: "+ (int)AlarmDates.toUnixTimeStamp(new Date()));
                    int newTime = time ;
                    while (newTime < (int)AlarmDates.toUnixTimeStamp(new Date())){
                        newTime = (int)AlarmDates.toUnixTimeStamp(AlarmDates.setNextTime(new Date((long)newTime * 1000),alarm)) ;
                    }
                    Log.w(TAG,"old time: "+time +" " + " new time: "+ newTime );
                    Storage.updateAlarmTimes(context,alarm.uid,time,newTime);
                }
            }

        }

        for (Alarm alarm : alarms) {
            Storage.removeDates(context, alarm.uid);
            AlarmDates dates = alarm.getAlarmDates();
            Storage.saveDates(context, dates);
            for (Date date : dates.getDates()) {
                Helper.scheduleAlarm(context, alarm.uid, date.getTime(), dates.getNotificationId(date));
                Log.w(TAG, "rescheduling alarm: " + alarm.uid +" | NewDate: " + date.getTime());
            }
        }
    }

    static void update(Context context, Alarm alarm) {
        AlarmDates prevDates = Storage.getDates(context, alarm.uid);
        AlarmDates dates = alarm.getAlarmDates();
        createSoundFile(context,alarm);
        for (Date date : dates.getDates()) {
            Helper.scheduleAlarm(context, alarm.uid, date.getTime(), dates.getNotificationId(date));
        }
        Storage.saveAlarm(context, alarm);
        Storage.saveDates(context, dates);
        if (prevDates == null) return;
        for (Date date : prevDates.getDates()) {
            Helper.cancelAlarm(context, dates.getNotificationId(date));
        }
    }

    static void removeAll(Context context) {
        Alarm[] alarms = Storage.getAllAlarms(context);
        for (Alarm alarm : alarms) {
            remove(context, alarm.uid);
        }
    }

    static void remove(Context context, String alarmUid) {
        if (sound != null) {
            sound.stop();
        }
        Alarm alarm = Storage.getAlarm(context, alarmUid);
        AlarmDates dates = Storage.getDates(context, alarm.uid);
        Storage.removeAlarm(context, alarm.uid);
        Storage.removeDates(context, alarm.uid);
        if (dates == null) return;
        for (Date date : dates.getDates()) {
            int notificationID = dates.getNotificationId(date);
            Helper.cancelAlarm(context, notificationID);
        }
    }

    static void enable(Context context, String alarmUid) {
        Alarm alarm = Storage.getAlarm(context, alarmUid);
        if (!alarm.active) {
            alarm.active = true;
            Storage.saveAlarm(context, alarm);
        } else {
            Log.d(TAG, "Alarm already active - exiting job");
            return;
        }
        AlarmDates dates = alarm.getAlarmDates();
        Storage.saveDates(context, dates);
        for (Date date : dates.getDates()) {
            Helper.scheduleAlarm(context, alarmUid, date.getTime(), dates.getNotificationId(date));
        }
    }

    static void disable(Context context, String alarmUid) {
        Alarm alarm = Storage.getAlarm(context, alarmUid);
        if (alarm.active) {
            alarm.active = false;
            Storage.saveAlarm(context, alarm);
        } else {
            Log.d(TAG, "Alarm already inactive - exiting job");
            return;
        }
        AlarmDates dates = Storage.getDates(context, alarmUid);
        for (Date date : dates.getDates()) {
            Helper.cancelAlarm(context, dates.getNotificationId(date));
        }
    }

    static void start(Context context, String alarmUid) {
        activeAlarmUid = alarmUid;
        sound = new Sound(context);
        Log.d(TAG,"the uid: " + alarmUid);
        sound.play(alarmUid);

        Log.d(TAG, "Starting " + activeAlarmUid);
    }

    static void stop(Context context) {
        Log.d(TAG, "Stopping " + activeAlarmUid);

        sound.stop();
        Alarm alarm = Storage.getAlarm(context, activeAlarmUid);
        AlarmDates dates = Storage.getDates(context, activeAlarmUid);
        if (alarm.repeating) {
            Date current = dates.getCurrentDate();
            Log.w(TAG,"current date is "+current);
            Log.w(TAG,"current alarm is "+alarm);
            Log.w(TAG,"old date to unixTimeStamp: "+AlarmDates.toUnixTimeStamp(current));


            Date updated = AlarmDates.setNextTime(current,alarm);
            dates.update(current, updated);
            Log.w(TAG,"new date to unixTimeStamp: "+AlarmDates.toUnixTimeStamp(updated));

            Storage.saveDates(context, dates);
            Storage.updateAlarmTimes(context,alarm.uid,(int)AlarmDates.toUnixTimeStamp(current),(int)AlarmDates.toUnixTimeStamp(updated));
            Log.w(TAG,"dates to update: "+AlarmDates.toJson(dates));
            Helper.scheduleAlarm(context, dates.alarmUid, updated.getTime(), dates.getCurrentNotificationId());
        } else {
            alarm.active = false;
            Storage.saveAlarm(context, alarm);
            Storage.removeDates(context, activeAlarmUid);
        }
        activeAlarmUid = null;
    }

    static void snooze(Context context) {
        Log.d(TAG, "Snoozing " + activeAlarmUid);

        sound.stop();
        Alarm alarm = Storage.getAlarm(context, activeAlarmUid);
        AlarmDates dates = Storage.getDates(context, activeAlarmUid);
        Date updated = AlarmDates.snooze(new Date(), alarm.snoozeInterval);
        dates.update(dates.getCurrentDate(), updated);
        Storage.saveDates(context, dates);
        Helper.scheduleAlarm(context, dates.alarmUid, updated.getTime(), dates.getCurrentNotificationId());
        activeAlarmUid = null;
    }

}