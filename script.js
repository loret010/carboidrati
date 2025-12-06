//smooth scroll per i link interni, NON TOCCARE ALTRO O SI ROMPE E DEVO SISTEMARLO DI NUOVO PER 2 ORE PERCHE NN SCROLLA

function initializeQuiz() {
  document.querySelectorAll('.main-nav a').forEach(a=>{
    a.addEventListener('click', function(e){
      // Se il link punta a una pagina esterna, non fare nulla
      if(this.getAttribute('href').includes('.html')) {
        return;
      }
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
  
  // Definizione delle risposte corrette per ogni domanda
  const quizAnswers = {
    '1': {
      correct: ['Glicogeno', 'Chitina'],
      type: 'checkbox'
    },
    '2': {
      correct: ['Hanno la stessa formula chimica', 'Sono isomeri', 'Il fruttosio è più dolce del glucosio'],
      type: 'checkbox'
    },
    '3': {
      correct: ['Energia'],
      type: 'radio'
    },
    '4': {
      correct: ['Radici'],
      type: 'radio'
    },
    '5': {
      correct: ['Amido', 'Glicogeno'],
      type: 'checkbox'
    }
  };

  // Associa event listener a ogni form del quiz
  document.querySelectorAll('.quiz-form').forEach(form => {
    form.addEventListener('submit', function(e){
      e.preventDefault();

      const questionId = this.getAttribute('data-question');
      const answerData = quizAnswers[questionId];
      
      // Trova il div con la risposta associato a questo form
      const answerBox = this.closest('.quiz-question').querySelector('.quiz-answer');
      const submitBtn = this.querySelector('input[type="submit"]');
      
      if(!answerBox) return;

      answerBox.hidden = false;

      const inputs = this.querySelectorAll('input[name="opt"]');
      inputs.forEach(input=>{
        const lbl = input.closest('label');
        if(!lbl) return;

        lbl.classList.remove('correct','incorrect');

        // Controlla se la risposta è corretta
        if(answerData.correct.includes(input.value)) {
          lbl.classList.add('correct');
        }

        // Controlla se l'utente ha sbagliato
        if(input.checked && !answerData.correct.includes(input.value)) {
          lbl.classList.add('incorrect');
        }

        input.disabled = true;
      });

      // Disabilita il bottone submit
      if(submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      }

      answerBox.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });
}

// Inizializza quando DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeQuiz);
} else {
  // Se lo script carica dopo il DOMContentLoaded
  initializeQuiz();
}

