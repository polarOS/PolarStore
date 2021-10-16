<div>
   <h1>jQuery Character Counter</h1>
   <h4>A jQuery based character counter for &lt;input&gt; and &lt;textarea&gt; HTML tags.</h4>
   <img src="readme/example.gif" alt="example gif">
   <hr>
   <div>
     <h4>What is this?</h4>
      <p>This simple plugin allows you to add a character counter to any &lt;input&gt; or &lt;textarea&gt; tag on your web-site with jQuery.</p>
       <h4>Installation</h4>
       <p>Just add the "charCounter.js" or "charCounter.min.js" to your web-page through the &lt;script&gt; tag.</p>
       <h4>How do I use it?</h4>
        <p>Easy.</p>
        <blockquote>
            $(element).charCounter({ options });
        </blockquote>
        <p>That's it.</p>
              <h4>Options</h4>
        <p><b>customClass</b></p>
        <p>Default: none. Allows you to customize your character counter with CSS. You can style it like a &lt;p&gt; HTML element.</p>
       <blockquote>
            <p>
                //CSS
            </p>
            <p>.style-for-counter{color: 'red'; font-size: 24pt;}</p>
            <p>//jQuery</p>
            <p>$(element).charCounter({ customClass: "style-for-counter" });</p>
        </blockquote>
        <p><b>Divider</b></p>
        <p>Default: 'slash'. Accepts: 'slash', 'dash' and 'bar. Changes character counter divider symbol ("/", "-" or "|")</p>
        <h4>fontSize</h4>
        <p>Default: '1rem'. Changes font size for the character counter.</p>
        <hr>
        <p>This plugin and its source code are free to use.</p>
   </div>
</div>
