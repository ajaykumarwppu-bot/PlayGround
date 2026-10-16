import {Config} from '@remotion/cli/config';

Config.setBrowserExecutable('/usr/bin/google-chrome');
Config.setChromeMode('chrome-for-testing');
Config.setChromiumOpenGlRenderer('swangle');
Config.setConcurrency(4);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(85);
Config.setOverwriteOutput(true);
Config.setDelayRenderTimeoutInMilliseconds(120000);
