package com.sparkstack.costcosaver;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    // Handle the splash screen transition.
    SplashScreen.installSplashScreen(this);
    super.onCreate(savedInstanceState);
  }
}
