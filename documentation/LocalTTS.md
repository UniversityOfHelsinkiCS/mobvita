## Text-to-speech in local development

Finnish and English speech come from TTS servers on `hpz440-2.cs.helsinki.fi` (ports 6000 and 6001). These servers can only be reached from the University of Helsinki network. The browser does not call them: the Node backend in the `mobvita_local` container does (`/api/fin_tts` and `/api/eng_tts`). To hear audio on localhost, forward both ports over SSH. `docker-compose-local.yml` already points the backend at the tunnel through `host.docker.internal`, which is how the container reaches your machine's `localhost`.

You need a CS department account that can log in to `melkki.cs.helsinki.fi`.

### 1. Open the tunnel

Run this once, replacing `<username>` with your CS username:

```
ssh -N -f -o ServerAliveInterval=30 -o ExitOnForwardFailure=yes -L 6000:hpz440-2.cs.helsinki.fi:6000 -L 6001:hpz440-2.cs.helsinki.fi:6001 <username>@melkki.cs.helsinki.fi
```

`ServerAliveInterval` keeps the tunnel from being dropped while idle. `ExitOnForwardFailure` makes ssh exit instead of lingering when the ports are already taken.

After you enter your password, the command returns to the prompt and keeps running in the background. It prints **NOTHING** on success.

### 2. Start the app

```
npm run dev
```

### 3. Check that it works

Both URLs should return an mp3 file:

- http://localhost:8000/api/fin_tts?text=moi&speed=0
- http://localhost:8000/api/eng_tts?text=hello

### Closing the tunnel

```
pkill -f hpz440-2
```

The tunnel does not survive a reboot or logout. Open it again before your next session. While the tunnel is closed, Finnish and English audio fail with a 500 error.

### Yandex voices

Yandex is a public cloud API, so it needs no tunnel. It does need a key. Put the key in `.env` in the form `YANDEX_KEY=Api-Key <key>`, then recreate the container. **Never** commit the key.

### Troubleshooting

- **`bind [127.0.0.1]:6000: Address already in use`**: a tunnel is already open, probably because you ran the command twice. Check with `lsof -nP -iTCP:6000 -sTCP:LISTEN`. Either keep the existing tunnel, or close it with `pkill -f hpz440-2` and open it again.
- **`/api/fin_tts` returns 500**: the tunnel is probably closed. Check with `lsof -nP -iTCP:6000 -sTCP:LISTEN`, and open it again if nothing is listening.
- **`/api/yandex_tts` returns 500**: run `docker logs mobvita_local` and look at the status code. A 401 with `Unknown api key` means Yandex rejects the key itself, so get a valid key.
- **Old instructions for building the tunnel mention `www-cache.helsinki.fi:8000` and a browser proxy**: the university has discontinued that proxy port, and the setup above does not need a proxy.
