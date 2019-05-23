const chord = require('tonal-chord'); // Turn chords into notes
const MidiWriter = require('midi-writer-js'); // Turn notes into midi events
const MidiPlayer = require('midi-player-js'); // Play Midi events
const Soundfont = require('soundfont-player'); // Attach audio to midi events

function getNotes() {
    let notes = [];

    let cinput = document.querySelector('input[name=chords]').value;
    if(cinput == null) return null

    cinput.split(' ').forEach(c => {
        notes.push(chord.notes(c))
    });

    notes.forEach((item, i)=> {
        notes[i] = item.map(n => n += '4')
    })

    return notes
}

function getDataUri() {
    let track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));
    
    let noteList = getNotes()
    if(noteList == null){
        return
    }
    
    noteList.forEach(el => {
        var note = new MidiWriter.NoteEvent({pitch: el, duration: 'd2'});
        track.addEvent(note);
    })
    
    var write = new MidiWriter.Writer(track);
    return write.dataUri()
}

function play() {
    let ac = new AudioContext();
    Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
        var Player = new MidiPlayer.Player(function(event) {            
            if(event.name == 'Note on') {
                piano.play(event.noteName, ac.currentTime, {gain:event.velocity/100})
            }
        });

        Player.loadDataUri(getDataUri())
        Player.play();
    })
}

document.querySelector('button').addEventListener('click', play);