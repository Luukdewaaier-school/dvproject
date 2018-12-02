<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBillingProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('billing_product', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('client_id');
            $table->integer('parent_id');
            $table->integer('article_id');
            $table->string('name');
            $table->double('price');
            $table->text('note');
            $table->string('billing_interval');
            $table->date('billing_last');
            $table->date('contract_date');
            $table->timestamp('activation_date')->nullable();
            $table->timestamp('expiration_date')->nullable();
            $table->boolean('terminated');
            $table->integer('terminated_by');
            $table->timestamp('terminated_on')->nullable();
            $table->boolean('op_terminated');
            $table->integer('op_terminated_by');
            $table->timestamp('op_terminated_on')->nullable();
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
        Schema::dropIfExists('billing_products');
    }
}
