package com.alarm;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Log;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

class Sound {

    private static final String TAG = "AlarmSound";
    private static final long DEFAULT_VIBRATION = 100;

    private AudioManager audioManager;
    private int userVolume;
    private MediaPlayer mediaPlayer;

    private MediaPlayer mediaPlayer2;

    private Vibrator vibrator;

    private Context context;

    Sound(Context context) {
        this.context = context;
        this.vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        this.audioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
        this.userVolume = audioManager.getStreamVolume(AudioManager.STREAM_ALARM);
        this.mediaPlayer = new MediaPlayer();
    }

    void play(String sound) {
        Uri soundUri = getSoundUri(sound);
        playSound(soundUri);
        startVibration();
    }

    void stop() {
        try {
                stopSound();
                stopVibration();


        } catch (IllegalStateException e) {
            Log.d(TAG, "Sound has probably been released already");
        }
    }

    private void playSound(Uri soundUri) {
        try {
         int resId = context.getResources().getIdentifier("test", "raw", context.getPackageName());
           Uri  _soundUri = Uri.parse("android.resource://" + context.getPackageName() + "/" + resId);
            if (!mediaPlayer.isPlaying()) {
                mediaPlayer = new MediaPlayer();
                mediaPlayer.setDataSource(context, soundUri);
                mediaPlayer.setAudioStreamType(AudioManager.STREAM_ALARM);
                mediaPlayer.setVolume(100, 100);
             //   mediaPlayer.setLooping(true);
                mediaPlayer.prepareAsync();

                mediaPlayer2 = new MediaPlayer();
                mediaPlayer2.setDataSource(context, _soundUri);
                mediaPlayer2.setAudioStreamType(AudioManager.STREAM_ALARM);
                mediaPlayer2.setVolume(100, 100);
              //  mediaPlayer2.setLooping(true);
                mediaPlayer2.prepareAsync();


                mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    @Override
                    public void onCompletion(MediaPlayer mp) {
                        mediaPlayer2.start();
                    }
                });

                mediaPlayer2.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    @Override
                    public void onCompletion(MediaPlayer mp) {
                        mediaPlayer.start();
                    }
                });

                mediaPlayer.start();
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to play sound", e);
        }
    }

    private void stopSound() {
        try {
            // reset the volume to what it was before we changed it.
            audioManager.setStreamVolume(AudioManager.STREAM_ALARM, userVolume, AudioManager.FLAG_PLAY_SOUND);
            if (mediaPlayer != null) {
                mediaPlayer.stop();
                mediaPlayer.release();
                mediaPlayer = null;
            }
            if (mediaPlayer2 != null) {
                mediaPlayer2.stop();
                mediaPlayer2.release();
                mediaPlayer2 = null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "ringtone: " + e.getMessage());
        }
    }

    private void startVibration() {
        vibrator.vibrate(DEFAULT_VIBRATION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(5000, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            //deprecated in API 26
            vibrator.vibrate(500);
        }

        long[] pattern = {0, 100, 1000};

        // The '0' here means to repeat indefinitely
        // '0' is actually the index at which the pattern keeps repeating from (the start)
        // To repeat the pattern from any other point, you could increase the index, e.g. '1'
        vibrator.vibrate(pattern, 0);
    }

    private void stopVibration() {
        vibrator.cancel();
    }

    private Uri getSoundUri(String soundName) {
        Uri soundUri;
        if (soundName.equals("default")) {
            soundUri = Settings.System.DEFAULT_RINGTONE_URI;
        } else {

            soundUri = Uri.parse("file:///data/data/com.medreminder/files/"+soundName+".mp3");
                    //Uri.parse("android.resource://" + context.getPackageName() + "/" + resId);
        }
        return soundUri;
    }
}
