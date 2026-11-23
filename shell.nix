{ pkgs ? import <nixpkgs> { config.allowUnfree = true; }}:

pkgs.mkShell {
	allowUnfree = true;
	buildInputs = with pkgs; [
		android-studio
		ionic-cli
    nodejs_22
	];

	shellHook = ''
		echo "Entered nix shell with android studio and ionic-cli"
	'';
}
