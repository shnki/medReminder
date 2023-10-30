package com.alarm;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class Module extends ReactContextBaseJavaModule {
    private static final String TAG = "Module";

    private final ReactApplicationContext reactContext;

    public Module(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        Helper.createNotificationChannel(reactContext);
    }

    @Override
    public String getName() {
        return "AlarmModule";
    }

    @ReactMethod
    public void getState (Promise promise) {
        promise.resolve(Manager.getActiveAlarm());
    }

    @ReactMethod
    public void set (ReadableMap details, Promise promise) {
        Alarm alarm = parseAlarmObject(reactContext, details);
        Manager.schedule(reactContext, alarm);
        promise.resolve(null);
    }

    @ReactMethod
    public void update (ReadableMap details, Promise promise) {
        Alarm alarm = parseAlarmObject(reactContext,details);
        Manager.update(reactContext, alarm);
        promise.resolve(null);
    }

    @ReactMethod
    public void remove (String alarmUid, Promise promise) {
        Manager.remove(reactContext, alarmUid);
        promise.resolve(null);
    }

    @ReactMethod
    public void removeAll (Promise promise) {
        Manager.removeAll(reactContext);
        promise.resolve(null);
    }

    @ReactMethod
    public void enable (String alarmUid, Promise promise) {
        Manager.enable(reactContext, alarmUid);
        promise.resolve(null);
    }

    @ReactMethod
    public void disable (String alarmUid, Promise promise) {
        Manager.disable(reactContext, alarmUid);
        promise.resolve(null);
    }

    @ReactMethod
    public void stop (Promise promise) {
        Manager.stop(reactContext);
        Intent serviceIntent = new Intent(reactContext, AlarmService.class);
        reactContext.stopService(serviceIntent);
        promise.resolve(null);
    }

    @ReactMethod
    public void snooze (Promise promise) {
        Manager.snooze(reactContext);
        Intent serviceIntent = new Intent(reactContext, AlarmService.class);
        reactContext.stopService(serviceIntent);
        promise.resolve(null);
    }

    @ReactMethod
    public void get (String alarmUid, Promise promise) {
        try {
            Alarm alarm = Storage.getAlarm(reactContext, alarmUid);
            promise.resolve(serializeAlarmObject(alarm));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            promise.reject(e.getMessage(), e);
        }
    }

    @ReactMethod
    public void getAll (Promise promise) {
        try {
            Alarm[] alarms = Storage.getAllAlarms(reactContext);
            WritableNativeArray serializedAlarms = serializeArray(alarms);
            promise.resolve(serializedAlarms);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e.getMessage());
            promise.reject(e.getMessage(), e);
        }
    }

    private Alarm parseAlarmObject (Context context, ReadableMap alarm) {
        String uid = alarm.getString("uid");
        String title = alarm.getString("title");
        String description = alarm.getString("description");
        String many = alarm.getString("many");
        int often = alarm.getInt("often");
        int hour = alarm.getInt("hour");
        int minutes = alarm.getInt("minutes");
        int snoozeInterval = alarm.getInt("snoozeInterval");
        int initialMinute = alarm.getInt("initialMinute");
        int initialHour = alarm.getInt("initialHour");
        boolean repeating = alarm.getBoolean("repeating");
        boolean active = alarm.getBoolean("active");
        String uri = alarm.getString("uri");
        ArrayList<Integer> times = new ArrayList<>();
        if (!alarm.isNull("times")) {
            ReadableArray rawtimes = alarm.getArray("times");
            for (int i = 0; i < rawtimes.size(); i++) {
                times.add(rawtimes.getInt(i));

            }
        }

       // Bitmap bitmap = BitmapUtils.getBitmapFromUri(context, imageUri);

       // Log.d(TAG,"uid:" + uid + "title:" +title+ "uri:" + imageUri);
        ArrayList<Integer> days = new ArrayList<>();
        if (!alarm.isNull("days")) {
            ReadableArray rawDays = alarm.getArray("days");
            for (int i = 0; i < rawDays.size(); i++) {
                days.add(rawDays.getInt(i));
            }
        }

        return new Alarm(uid, days, hour, minutes, snoozeInterval, title, description, repeating, active ,uri, times,initialHour,initialMinute,many,often);
    }

    private WritableMap serializeAlarmObject (Alarm alarm) {
        WritableNativeMap map = new WritableNativeMap();
        map.putString("uid", alarm.uid);
        map.putString("title", alarm.title);
        map.putString("description", alarm.description);
        map.putInt("hour", alarm.hour);
        map.putInt("minutes", alarm.minutes);
        map.putInt("snoozeInterval", alarm.snoozeInterval);
        map.putArray("days", serializeArray(alarm.days));
        map.putBoolean("repeating", alarm.repeating);
        map.putBoolean("active", alarm.active);
        map.putString("uri" , alarm.uri);
        map.putInt("initialHour",alarm.initialHour);
        map.putInt("initialMinute",alarm.initialMinute);
        map.putInt("often",alarm.often);
        map.putString("many",alarm.many);
        map.putArray("times", serializeArray(alarm.times));

        return map;
    }

    private WritableNativeArray serializeArray (ArrayList<Integer> a) {
        WritableNativeArray array = new WritableNativeArray();
        for (int value : a) array.pushInt(value);
        return array;
    }

    private WritableNativeArray serializeArray (Alarm[] a) {
        WritableNativeArray array = new WritableNativeArray();
        for (Alarm alarm : a) array.pushMap(serializeAlarmObject(alarm));
        return array;
    }
}
