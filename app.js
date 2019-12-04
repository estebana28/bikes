const bikeList = document.querySelector('#bike-list');
const form = document.querySelector('#add-bike-form');

function renderBikes(doc) {
    let li = document.createElement('li');
    let brand = document.createElement('span');
    let model = document.createElement('span');
    let cc = document.createElement('span');
    let icon = document.createElement('i');

    icon.setAttribute('class', 'tiny material-icons')
    li.setAttribute('data-id', doc.id);
    li.setAttribute('class', 'collection-item')
    brand.textContent = doc.data().brand;
    model.textContent = doc.data().model;
    cc.textContent = doc.data().cc;
    icon.textContent = 'clear';

    li.appendChild(brand);
    li.appendChild(model);
    li.appendChild(cc);
    li.appendChild(icon);

    bikeList.appendChild(li);

    // delete data from db

    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('bikes').doc(id).delete();
    })
};

// retrieve data from db

// db.collection('bikes').orderBy('brand').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderBikes(doc);
//     });
// });


// save data to db

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('bikes').add({
        brand: form.brand.value,
        model: form.model.value,
        cc: form.cc.value
    });
    form.brand.value = '';
    form.model.value = '';
    form.cc.value = '';
});

// realtime retrieve data from db
db.collection('bikes').orderBy('brand').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderBikes(change.doc);
        } else if(change.type == 'removed'){
            let li = bikeList.querySelector('[data-id=' + change.doc.id + ']');
            bikeList.removeChild(li);
        }
    });
})
