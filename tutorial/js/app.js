var app = new App.Kernel('dev', true);

try {
    app.boot();
} catch (e) {
    console.log(e);
}