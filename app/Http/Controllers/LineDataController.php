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

        return json_encode($this->formatData());
    }

    private function formatData()
    {
        $data2 = [];
        \uksort($this->lineData, function($a, $b) {
            $a = Carbon::createFromFormat('d-m-y', $a);
            $b = Carbon::createFromFormat('d-m-y', $b);

            if ($a->gt($b)) {
                return 1;
            } else {
                return -1;
            }
        });

        foreach ($this->lineData as $client => $data) {
            $item = new \stdClass();
            $item->name = $client;
            $item->value = $data;
            $data2[] = $item;
        }

        return $data2;
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
            $key = $currentMonth->format('d-m-y');

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
            $key = $currentMonth->format('d-m-y');

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
            $key = $currentMonth->format('d-m-y');

            if (!\array_key_exists($key, $this->lineData)) {
                $this->lineData[$key] = $product->price;
            } else {
                $this->lineData[$key] += $product->price;
            }

            $currentMonth->addYears(1);
        }
    }
}
