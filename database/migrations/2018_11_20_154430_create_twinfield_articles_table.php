<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTwinfieldArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('twinfield_articles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code');
            $table->string('subcode');
            $table->string('type');
            $table->string('name');
            $table->string('subname');
            $table->double('price');
            $table->integer('vat_id');
            $table->boolean('allow_change_vat');
            $table->boolean('allow_change_price');
            $table->boolean('twinfield_product');
            $table->boolean('domain_product');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('twinfield_articles');
    }
}
