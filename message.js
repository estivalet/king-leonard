function Message(charsPerRow) {
    this.charsPerRow = charsPerRow;
    this.message = '';
    this.displaytick = 0;

    this.setMessage = function(message) {
        this.displaytick = 200;
        this.message  = message;
    }

    this.render = function(context) {
        if (this.displaytick > 0 ) {
            var alpha;
            if (this.displaytick > 100 ) {
                alpha = 1.0;
            } else {
                alpha = (this.displaytick / 100 ).toFixed(2);
            }
            context.fillStyle =  "rgba( 255 , 255 ,255, " + alpha +")";
            if (this.message.length < this.charsPerRow ) {
                context.fillText( this.message , canvas.width /2 - this.message.length * 7 / 2, canvas.height - 13  );
            } else {
                var rowcount = (( this.message.length / this.charsPerRow ) >> 0 ) + 1;
                for ( i = 0 ; i < rowcount ; i++ ) {
                    context.fillText( 
                        this.message.substring(i * this.charsPerRow  , (i + 1) * this.charsPerRow ), 
                        canvas.width /2 - this.charsPerRow * 7 / 2, 
                        canvas.height - 13 * (rowcount-i)   
                    );
                }
            }
        }
    }    

    this.update = function() {
        if (this.displaytick > 0 ) {
            this.displaytick -= 1;
        }
    }
}