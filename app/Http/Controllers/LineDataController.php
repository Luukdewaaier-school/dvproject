<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\BillingProduct;
use Illuminate\Http\Request;

class LineDataController extends Controller
{
    private $lineData = [];

    private $from = '';

    private $to = '';

    public function getLineData(Request $request)
    {
        $this->from = Carbon::createFromFormat('m-d-Y', $request->input('from'));
        $this->to = Carbon::createFromFormat('m-d-Y', $request->input('to'));

        $this->processData(BillingProduct::whereNotIn('article_id', explode(',', $request->input( 'exclude')))->get());

        return json_encode($this->lineData);
    }

    private function processData($products)
    {
        foreach ($products as $product) {
            switch ($product->billing_interval) {
                case 'monthly':
                    $this->handleMonth($product);
                    break;
                case 'quarterly':
                    $this->handleQuarter($product);
                    break;
                case 'annually':
                    $this->handleYear($product);
                    break;
            }
        }
    }

    private function handleMonth($product)
    {
        $lastBilled = Carbon::createFromFormat('Y-m-d', $product->billing_last);
        $diffFrom = $lastBilled->diffInMonths($this->from);
        $diffTo = $lastBilled->diffInMonths($this->to);
        $currentMonth = $lastBilled->subMonths($diffFrom);
        $total = $diffFrom + $diffTo - 1;

        for ($i = 0; $i < $total; $i++) {
            $key = $currentMonth->format('d M Y');

            if (!\array_key_exists($key, $this->lineData)) {
                $this->lineData[$key] = $product->price;
            } else {
                $this->lineData[$key] += $product->price;
            }

            $currentMonth->addMonth();
        }
    }

    private function handleQuarter($product)
    {
        $lastBilled = Carbon::createFromFormat('Y-m-d', $product->billing_last);
        $diffFrom = \floor($lastBilled->diffInMonths($this->from) /3);
        $diffTo = \floor($lastBilled->diffInMonths($this->to) / 3);
        $currentMonth = $lastBilled->subMonths($diffFrom * 3);
        $total = $diffFrom + $diffTo;

        for ($i = 0; $i < $total; $i++) {
            $key = $currentMonth->format('d M Y');

            if (!\array_key_exists($key, $this->lineData)) {
                $this->lineData[$key] = $product->price;
            } else {
                $this->lineData[$key] += $product->price;
            }

            $currentMonth->addMonths(3);
        }
    }

    private function handleYear($product)
    {
        $lastBilled = Carbon::createFromFormat('Y-m-d', $product->billing_last);
        $diffFrom = \floor($lastBilled->diffInYears($this->from));
        $diffTo = \floor($lastBilled->diffInYears($this->to));
        $currentMonth = $lastBilled->subYears($diffFrom);
        $total = $diffFrom + $diffTo + 1;

        for ($i = 0; $i < $total; $i++) {
            $key = $currentMonth->format('d M Y');

            if (!\array_key_exists($key, $this->lineData)) {
                $this->lineData[$key] = $product->price;
            } else {
                $this->lineData[$key] += $product->price;
            }

            $currentMonth->addYears(1);
        }
    }
}
