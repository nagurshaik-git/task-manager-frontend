const express = require('express')
const app = express()
const port = process.env.port || 8080

app.use(express.static('./dist/task-manager'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/task-manager/'}
  );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})