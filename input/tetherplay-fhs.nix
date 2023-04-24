{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "tetherplay-fhs-env";
  targetPkgs = pkgs: with pkgs; [ 
    udev
    libudev
    libevdev
    pkgconfig
    rust-bindgen
    rustfmt
    #makeheaders not in nix yet
  ];
  profile = '' export SHELL=zsh '';
  extraOutputsToInstall = [ "dev" ];
  runScript = ''$SHELL'';
}).env
