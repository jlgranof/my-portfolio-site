import type { FsDir } from '../lib/terminal/filesystem'
import { caesar, xorEncode } from '../lib/terminal/cipher'
import { profile } from './profile'

// The clue trail:
//   /var/log/system.log        → mentions the legacy ROTATION-3 archive cipher
//   /classified/alpha.enc      → Caesar shift 3; plaintext reveals the uplink key
//   /classified/dossier.enc    → XOR with that key; success unlocks the DOSSIER window
const ALPHA_PLAIN =
  'GRANOF//MEMO 0x2A: ARCHIVE CIPHER RETIRED. NEW UPLINK KEY: "REDSHIFT". BURN AFTER READING.'
const DOSSIER_PLAIN =
  'GRANOF//IDENTITY FILE VERIFIED. CLEARANCE ELEVATED. RUN: open dossier'

export const FS_ROOT: FsDir = {
  type: 'dir',
  children: {
    home: {
      type: 'dir',
      children: {
        commander: {
          type: 'dir',
          children: {
            'readme.txt': {
              type: 'file',
              content: [
                'WELCOME TO GRANOF STATION.',
                `OPERATOR: ${profile.identity.name} — ${profile.identity.rank}`,
                "Type 'help' for commands. The archives keep secrets.",
              ].join('\n'),
            },
            'mission_briefing.txt': {
              type: 'file',
              content: profile.about.briefing,
            },
            'notes.txt': {
              type: 'file',
              content: [
                'TODO: rotate the archive ciphers. The old rotation is ancient — Julius-era, honestly.',
                'TODO: stop leaving keys in memos.',
              ].join('\n'),
            },
          },
        },
      },
    },
    var: {
      type: 'dir',
      children: {
        log: {
          type: 'dir',
          children: {
            'system.log': {
              type: 'file',
              content: [
                '[BOOT] GRANOF COMPUTER v4.12.16',
                '[WARN] /classified mount: LEGACY ARCHIVE CIPHER "ROTATION-3" STILL ACTIVE',
                '[INFO] uplink keys rotated — see memo alpha',
                "[HINT] decrypt usage: decrypt <file> <key>  (numbers rotate, words xor)",
              ].join('\n'),
            },
          },
        },
      },
    },
    classified: {
      type: 'dir',
      children: {
        'alpha.enc': {
          type: 'file',
          encrypted: true,
          content: caesar(ALPHA_PLAIN, 3),
        },
        'dossier.enc': {
          type: 'file',
          encrypted: true,
          onDecrypt: 'dossier',
          content: xorEncode(DOSSIER_PLAIN, 'REDSHIFT'),
        },
      },
    },
  },
}
