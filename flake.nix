{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts"; 
  };

  outputs = inputs: inputs.flake-parts.lib.mkFlake { inherit inputs; } {
    systems = [ "x86_64-linux" "aarch64-darwin" ];

    perSystem = { pkgs, ...  }: let
      # npm's workerd binary needs the Nix dynamic linker on Linux.
      workerdLauncher = pkgs.writeShellScript "nexboard-workerd" ''
        set -eu
        workerd_path=$(node --input-type=module -e '
          import { createRequire } from "node:module";
          const require = createRequire(process.cwd() + "/package.json");
          const runtimeRequire = createRequire(require.resolve("wrangler"));
          process.stdout.write(runtimeRequire("workerd").default);
        ')
        exec ${pkgs.stdenv.cc.bintools.dynamicLinker} \
          --library-path ${pkgs.lib.makeLibraryPath [ pkgs.stdenv.cc.cc pkgs.glibc ]} \
          "$workerd_path" "$@"
      '';
    in {
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.pnpm
          pkgs.nodejs_24
        ];
        env = pkgs.lib.optionalAttrs pkgs.stdenv.hostPlatform.isLinux {
          MINIFLARE_WORKERD_PATH = "${workerdLauncher}";
        };
      };
    };
  };
}
