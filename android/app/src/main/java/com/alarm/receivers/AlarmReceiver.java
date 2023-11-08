package com.alarm.receivers;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import com.alarm.AlarmDates;
import com.alarm.AlarmService;
import com.alarm.Manager;

import java.util.Date;

public class AlarmReceiver extends BroadcastReceiver {

    private static final String TAG = "AlarmReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String alarmUid = intent.getStringExtra("ALARM_UID");
        long unixTIme = intent.getLongExtra("UNIX_TIME_STAMP",0);

        Log.w(TAG, intent+" intent");
        Log.d(TAG, "received alarm: " + alarmUid);
        Log.w(TAG, "ALARM UniX : "+ unixTIme);
        Log.w(TAG,"the unixTimeStamp of now"+AlarmDates.toUnixTimeStamp(new Date()));
        if(AlarmDates.toUnixTimeStamp(new Date()) <= unixTIme){
            Toast.makeText(context, "received alarm: " + alarmUid, Toast.LENGTH_LONG).show();

            Intent serviceIntent = new Intent(context, AlarmService.class);
            serviceIntent.putExtra("ALARM_UID", alarmUid);
            serviceIntent.putExtras(serviceIntent);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent);
            } else {
                context.startService(serviceIntent);
            }

        }
    }
}
