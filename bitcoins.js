var five = require("johnny-five");
var Firebase = require("firebase");
var board = new five.Board();


// Ajsutar el modo Debug
debugMode = false;

// Ajustar la moneda
var currency = "dollar"; // "dollar" or "euro"

// Ajustar la tasa de cambio Dolar -> Euro
var euroRate = 0.89;

// Base de datos con la información de los Bitcoins.
var myFirebaseRef = new Firebase("https://publicdata-bitcoin.firebaseio.com/");


board.on("ready", function() {
  
// LCD con interfaz I2C
var lcd = new five.LCD({
    controller: "LCM1602",
    pins: ["A5", "A4"],
    rows: 4,
    cols: 20
});

lcd.useChar("euro");


myFirebaseRef.on("value", function(snapshot) {
  var newChange = snapshot.val();
  // Modo Debug
    if (debugMode) {
      console.log("**************");
      console.log("Ask($): " + newChange.ask);
      console.log("Bid($): " + newChange.bid);
      console.log("Last($): " + newChange.last);
      console.log("--------------");
      console.log("Conversion Rate: "+euroRate);
      console.log("Currency selected: "+currency);      
      console.log("--------------");
      console.log("Ask(€): " +(newChange.ask*euroRate).toFixed(2));
      console.log("Bid(€): " +(newChange.bid*euroRate).toFixed(2));
      console.log("Last(€): " +(newChange.last*euroRate).toFixed(2));
      console.log("**************");               
    };

    // Si la moneda elegida es dolares.
    if (currency == "dollar") {
      lcd.clear();
      lcd.cursor(0, 0).print("==== BITCOIN ($) ===");
      lcd.cursor(1, 0).print("Ask: "+newChange.ask+"$");
      lcd.cursor(2, 0).print("Bid: "+newChange.bid+"$");
      lcd.cursor(3, 0).print("Last: "+newChange.last+"$");
    /*
        Si la moneda elegida es Euros
        Se multiplica el valor por el cambio de Dolar/euro... y luego se redondea a dos decimales
    */
    } else if(currency == "euro"){
      lcd.clear();
      lcd.cursor(0, 0).print("==== BITCOIN (:euro:) ===");
      lcd.cursor(1, 0).print("Ask: "+(newChange.ask*euroRate).toFixed(2)+":euro:"); 
      lcd.cursor(2, 0).print("Bid: "+(newChange.bid*euroRate).toFixed(2)+":euro:");
      lcd.cursor(3, 0).print("Last: "+(newChange.last*euroRate).toFixed(2)+":euro:");      
    // En caso de monedas no reconocidas, se muestra el siguiente error.
    } else{
      lcd.clear();
      lcd.cursor(0, 0).print("===== BITCOIN (X) ====");
      lcd.cursor(1, 0).print("ERROR!! CURRENCY.");
      lcd.cursor(2, 0).print("Try Dollar or Euro.");
      lcd.cursor(0, 0).print("====================");
    };

});

}); // board